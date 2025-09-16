#!/usr/bin/env bash
set -euo pipefail

# HOAdoor Google Cloud deployment helper
#
# This script provisions the infrastructure required to run the HOAdoor
# Next.js application on Google Cloud and deploys the latest source to
# Cloud Run. It assumes you have authenticated with `gcloud auth login`
# and have the appropriate IAM permissions to manage the referenced
# resources.

# Requirements:
#   - gcloud CLI (with beta components)
#   - psql (Cloud SQL proxy is handled automatically by gcloud)
#   - python3 (for URL encoding)
#   - An environment configuration file (default: .env.gcp) that provides
#     deployment metadata and runtime secrets. See docs/deploying-to-gcp.md
#     for the expected format and guidance.

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." >/dev/null 2>&1 && pwd)"
ENV_FILE="${ENV_FILE:-${REPO_ROOT}/.env.gcp}"
INIT_SQL_FILE="${REPO_ROOT}/init-db.sql"

log() {
  printf '\n\033[1;34m==>\033[0m %s\n' "$1"
}

warn() {
  printf '\n\033[1;33m[warning]\033[0m %s\n' "$1"
}

err() {
  printf '\n\033[1;31m[error]\033[0m %s\n' "$1" >&2
  exit 1
}

require_command() {
  local cmd="$1"
  command -v "$cmd" >/dev/null 2>&1 || err "Missing required command: $cmd"
}

parse_env_file() {
  local file="$1"
  declare -gA ENV_VARS=()
  while IFS='=' read -r raw_key raw_value || [[ -n "$raw_key" ]]; do
    [[ -z "$raw_key" ]] && continue
    [[ "$raw_key" =~ ^# ]] && continue
    local key="${raw_key%%[$'\r'\n ]*}"
    key="${key//[[:space:]]/}"
    [[ -z "$key" ]] && continue

    local value="${raw_value}" 
    value="${value%$'\r'}"
    value="${value%$'\n'}"

    # Trim leading whitespace
    value="${value##[[:space:]]}"
    # Remove surrounding quotes if present
    if [[ "${value}" == \"*\" ]]; then
      value="${value:1:-1}"
    fi

    ENV_VARS["$key"]="$value"
  done < "$file"
}

pop_env() {
  local key="$1"
  local default_value="${2-__HOADOOR_NO_DEFAULT__}"
  if [[ -n "${ENV_VARS[$key]+x}" && -n "${ENV_VARS[$key]}" ]]; then
    local value="${ENV_VARS[$key]}"
    unset "ENV_VARS[$key]"
    printf '%s' "$value"
    return 0
  fi

  if [[ "$default_value" != "__HOADOOR_NO_DEFAULT__" ]]; then
    unset "ENV_VARS[$key]"
    printf '%s' "$default_value"
    return 0
  fi

  err "Missing required value for $key in ${ENV_FILE}"
}

url_encode() {
  python3 -c "import urllib.parse, sys; print(urllib.parse.quote_plus(sys.argv[1]))" "$1"
}

ensure_secret() {
  local secret_name="$1"
  local secret_value="$2"

  if ! gcloud secrets describe "$secret_name" --project="$PROJECT_ID" >/dev/null 2>&1; then
    gcloud secrets create "$secret_name" \
      --project="$PROJECT_ID" \
      --replication-policy="automatic"
  fi

  printf '%s' "$secret_value" | gcloud secrets versions add "$secret_name" \
    --project="$PROJECT_ID" \
    --data-file=- >/dev/null
}

ensure_api() {
  local api="$1"
  gcloud services enable "$api" --project="$PROJECT_ID" >/dev/null
}

ensure_sql_instance() {
  if gcloud sql instances describe "$DB_INSTANCE" --project="$PROJECT_ID" >/dev/null 2>&1; then
    log "Cloud SQL instance $DB_INSTANCE already exists"
    return
  fi

  log "Creating Cloud SQL instance $DB_INSTANCE"
  gcloud sql instances create "$DB_INSTANCE" \
    --project="$PROJECT_ID" \
    --database-version=POSTGRES_15 \
    --region="$DB_REGION" \
    --tier="$DB_TIER" \
    --storage-auto-increase \
    --backup-start-time="$DB_BACKUP_START" \
    --maintenance-window-day="$DB_MAINTENANCE_DAY" \
    --maintenance-window-hour="$DB_MAINTENANCE_HOUR" \
    --availability-type="$DB_AVAILABILITY_TYPE"
}

ensure_database() {
  if gcloud sql databases describe "$DB_NAME" --instance="$DB_INSTANCE" --project="$PROJECT_ID" >/dev/null 2>&1; then
    log "Database $DB_NAME already exists"
    return
  fi

  log "Creating database $DB_NAME"
  gcloud sql databases create "$DB_NAME" \
    --instance="$DB_INSTANCE" \
    --project="$PROJECT_ID" >/dev/null
}

ensure_sql_user() {
  if gcloud sql users list --instance="$DB_INSTANCE" --project="$PROJECT_ID" --format="value(name)" | grep -Fxq "$DB_USER"; then
    log "Updating password for Cloud SQL user $DB_USER"
    gcloud sql users set-password "$DB_USER" \
      --instance="$DB_INSTANCE" \
      --project="$PROJECT_ID" \
      --password="$DB_PASSWORD" >/dev/null
  else
    log "Creating Cloud SQL user $DB_USER"
    gcloud sql users create "$DB_USER" \
      --instance="$DB_INSTANCE" \
      --project="$PROJECT_ID" \
      --password="$DB_PASSWORD" >/dev/null
  fi
}

ensure_service_account() {
  if gcloud iam service-accounts describe "$SERVICE_ACCOUNT_EMAIL" --project="$PROJECT_ID" >/dev/null 2>&1; then
    log "Service account $SERVICE_ACCOUNT_EMAIL already exists"
  else
    log "Creating service account $SERVICE_ACCOUNT_EMAIL"
    gcloud iam service-accounts create "$SERVICE_ACCOUNT_NAME" \
      --project="$PROJECT_ID" \
      --display-name="HOAdoor Cloud Run" >/dev/null
  fi

  log "Granting IAM roles to $SERVICE_ACCOUNT_EMAIL"
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/cloudsql.client" \
    --quiet >/dev/null
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet >/dev/null
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/artifactregistry.reader" \
    --quiet >/dev/null
}

bootstrap_extensions() {
  if [[ ! -f "$INIT_SQL_FILE" ]]; then
    warn "init-db.sql not found, skipping extension bootstrap"
    return
  fi

  log "Installing required PostgreSQL extensions in $DB_NAME"
  PGPASSWORD="$POSTGRES_SUPERUSER_PASSWORD" gcloud sql connect "$DB_INSTANCE" \
    --user=postgres \
    --database="$DB_NAME" \
    --project="$PROJECT_ID" \
    --quiet < "$INIT_SQL_FILE"
}

prepare_env_mappings() {
  local public_keys_csv="$1"
  local IFS=','
  read -ra PUBLIC_KEYS <<< "$public_keys_csv"

  declare -gA PUBLIC_ENV=()
  declare -gA SECRET_ENV=()

  for key in "${!ENV_VARS[@]}"; do
    local value="${ENV_VARS[$key]}"
    local is_public=0
    for public_key in "${PUBLIC_KEYS[@]}"; do
      local trimmed="${public_key//[[:space:]]/}"
      [[ -z "$trimmed" ]] && continue
      if [[ "$key" == "$trimmed" ]]; then
        is_public=1
        break
      fi
    done

    if [[ $is_public -eq 1 ]]; then
      PUBLIC_ENV[$key]="$value"
    else
      SECRET_ENV[$key]="$value"
    fi
  done
}

prepare_runtime_config() {
  declare -g RUNTIME_ENV_ARG
  declare -g RUNTIME_SECRET_ARG=""
  declare -gA SECRET_NAME_LOOKUP=()

  local -a env_pairs=("HOSTNAME=0.0.0.0" "NODE_ENV=production")
  for key in "${!PUBLIC_ENV[@]}"; do
    env_pairs+=("${key}=${PUBLIC_ENV[$key]}")
  done
  RUNTIME_ENV_ARG="$(IFS=','; echo "${env_pairs[*]}")"

  if [[ ${#SECRET_ENV[@]} -gt 0 ]]; then
    local -a secret_pairs=()
    for key in "${!SECRET_ENV[@]}"; do
      local sanitized_key
      sanitized_key="$(printf '%s' "$key" | tr '[:upper:]' '[:lower:]' | tr '_' '-')"
      local secret_name="${SECRET_PREFIX}-${sanitized_key}"
      ensure_secret "$secret_name" "${SECRET_ENV[$key]}"
      SECRET_NAME_LOOKUP[$key]="$secret_name"
      secret_pairs+=("${key}=${secret_name}:latest")
    done
    RUNTIME_SECRET_ARG="$(IFS=','; echo "${secret_pairs[*]}")"
  fi
}

deploy_cloud_run() {
  local auth_flag="--allow-unauthenticated"
  if [[ "${ALLOW_UNAUTHENTICATED,,}" != "true" ]]; then
    auth_flag="--no-allow-unauthenticated"
  fi

  log "Deploying Cloud Run service ${SERVICE_NAME}"
  local -a deploy_cmd=(
    gcloud run deploy "$SERVICE_NAME"
    --project="$PROJECT_ID"
    --region="$REGION"
    --source="$REPO_ROOT"
    --service-account="$SERVICE_ACCOUNT_EMAIL"
    "$auth_flag"
    --execution-environment="$EXECUTION_ENVIRONMENT"
    --max-instances="$MAX_INSTANCES"
    --min-instances="$MIN_INSTANCES"
    --cpu="$RUN_CPU"
    --memory="$RUN_MEMORY"
    --timeout="$RUN_TIMEOUT"
    --concurrency="$RUN_CONCURRENCY"
    --add-cloudsql-instances="$INSTANCE_CONNECTION_NAME"
    --set-env-vars "$RUNTIME_ENV_ARG"
  )

  if [[ -n "$RUNTIME_SECRET_ARG" ]]; then
    deploy_cmd+=(--set-secrets "$RUNTIME_SECRET_ARG")
  fi

  "${deploy_cmd[@]}"
}

run_prisma_migrations() {
  local job_name="${SERVICE_NAME}-migrate"
  local image
  image="$(gcloud run services describe "$SERVICE_NAME" --project="$PROJECT_ID" --region="$REGION" --format="value(spec.template.spec.containers[0].image)")"

  log "Deploying Cloud Run job ${job_name} for Prisma migrations"
  local -a job_cmd=(
    gcloud run jobs deploy "$job_name"
    --project="$PROJECT_ID"
    --region="$REGION"
    --image="$image"
    --service-account="$SERVICE_ACCOUNT_EMAIL"
    --add-cloudsql-instances="$INSTANCE_CONNECTION_NAME"
    --max-retries=0
    --cpu="$RUN_CPU"
    --memory="$RUN_MEMORY"
    --set-env-vars "$RUNTIME_ENV_ARG"
    --command=npx
    --args=prisma,migrate,deploy
  )

  if [[ -n "$RUNTIME_SECRET_ARG" ]]; then
    job_cmd+=(--set-secrets "$RUNTIME_SECRET_ARG")
  fi

  "${job_cmd[@]}"

  log "Executing Prisma migrations via Cloud Run job"
  gcloud run jobs execute "$job_name" \
    --project="$PROJECT_ID" \
    --region="$REGION" \
    --wait >/dev/null
}

main() {
  [[ -f "$ENV_FILE" ]] || err "Environment file not found: $ENV_FILE"

  require_command gcloud
  require_command psql
  require_command python3

  parse_env_file "$ENV_FILE"

  PROJECT_ID="$(pop_env PROJECT_ID)"
  REGION="$(pop_env REGION "us-central1")"
  SERVICE_NAME="$(pop_env SERVICE_NAME "hoadoor")"
  SERVICE_ACCOUNT_NAME="$(pop_env SERVICE_ACCOUNT_NAME "hoadoor-runner")"
  DB_INSTANCE="$(pop_env DB_INSTANCE "hoadoor-postgres")"
  DB_REGION="$(pop_env DB_REGION "$REGION")"
  DB_TIER="$(pop_env DB_TIER "db-custom-2-7680")"
  DB_NAME="$(pop_env DB_NAME "hoadoor")"
  DB_USER="$(pop_env DB_USER)"
  DB_PASSWORD="$(pop_env DB_PASSWORD)"
  POSTGRES_SUPERUSER_PASSWORD="$(pop_env POSTGRES_SUPERUSER_PASSWORD)"
  DB_BACKUP_START="$(pop_env DB_BACKUP_START "02:00")"
  DB_MAINTENANCE_DAY="$(pop_env DB_MAINTENANCE_DAY "1")"
  DB_MAINTENANCE_HOUR="$(pop_env DB_MAINTENANCE_HOUR "3")"
  DB_AVAILABILITY_TYPE="$(pop_env DB_AVAILABILITY_TYPE "ZONAL")"
  SECRET_PREFIX="$(pop_env SECRET_PREFIX "hoadoor")"
  PUBLIC_ENV_KEYS="$(pop_env PUBLIC_ENV_KEYS "NEXTAUTH_URL,EMAIL_SERVER_HOST,EMAIL_SERVER_PORT,EMAIL_FROM,EMAIL_SERVER_USER,EMAIL_FROM_NAME")"
  RUN_CPU="$(pop_env RUN_CPU "2")"
  RUN_MEMORY="$(pop_env RUN_MEMORY "2Gi")"
  RUN_TIMEOUT="$(pop_env RUN_TIMEOUT "600")"
  RUN_CONCURRENCY="$(pop_env RUN_CONCURRENCY "80")"
  MAX_INSTANCES="$(pop_env MAX_INSTANCES "4")"
  MIN_INSTANCES="$(pop_env MIN_INSTANCES "0")"
  EXECUTION_ENVIRONMENT="$(pop_env EXECUTION_ENVIRONMENT "gen2")"
  ALLOW_UNAUTHENTICATED="$(pop_env ALLOW_UNAUTHENTICATED "true")"

  # After popping known keys, ENV_VARS contains runtime config values to deploy.

  log "Using project ${PROJECT_ID} in region ${REGION}"

  ensure_api run.googleapis.com
  ensure_api cloudbuild.googleapis.com
  ensure_api artifactregistry.googleapis.com
  ensure_api sqladmin.googleapis.com
  ensure_api secretmanager.googleapis.com
  ensure_api iam.googleapis.com

  ensure_sql_instance
  ensure_database
  ensure_sql_user

  log "Updating postgres superuser password"
  gcloud sql users set-password postgres \
    --instance="$DB_INSTANCE" \
    --project="$PROJECT_ID" \
    --password="$POSTGRES_SUPERUSER_PASSWORD" >/dev/null

  bootstrap_extensions

  INSTANCE_CONNECTION_NAME="$(gcloud sql instances describe "$DB_INSTANCE" --project="$PROJECT_ID" --format="value(connectionName)")"

  local encoded_user encoded_pass encoded_db
  encoded_user="$(url_encode "$DB_USER")"
  encoded_pass="$(url_encode "$DB_PASSWORD")"
  encoded_db="$(url_encode "$DB_NAME")"

  DATABASE_URL="postgresql://${encoded_user}:${encoded_pass}@/${encoded_db}?host=/cloudsql/${INSTANCE_CONNECTION_NAME}&schema=public"
  ENV_VARS[DATABASE_URL]="$DATABASE_URL"

  SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
  ensure_service_account

  prepare_env_mappings "$PUBLIC_ENV_KEYS"
  prepare_runtime_config

  deploy_cloud_run
  run_prisma_migrations

  log "Deployment complete. Cloud Run service URL:"
  gcloud run services describe "$SERVICE_NAME" \
    --project="$PROJECT_ID" \
    --region="$REGION" \
    --format="value(status.url)"
}

main "$@"
