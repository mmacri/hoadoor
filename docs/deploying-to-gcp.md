# Deploying HOAdoor to Google Cloud

This guide walks through provisioning the infrastructure needed to run HOAdoor on Google Cloud and using the `scripts/deploy-gcp.sh` helper to build and deploy the application. The script automates the heavy lifting so you can bootstrap a production-ready stack in a few minutes.

## What the script does

Running `./scripts/deploy-gcp.sh` will:

1. Enable the required Google Cloud APIs (Cloud Run, Cloud Build, Artifact Registry, Secret Manager, IAM, and Cloud SQL Admin).
2. Provision a Cloud SQL for PostgreSQL instance, create the application database/user, and install the `pg_trgm` and `unaccent` extensions needed for search.
3. Configure a dedicated service account with the minimum roles required by Cloud Run.
4. Build the Next.js app from source with Cloud Build and deploy it to Cloud Run.
5. Materialize runtime environment variables and secrets in Secret Manager and attach them to the service.
6. Create and execute a Cloud Run job that runs `prisma migrate deploy` so the new database is migrated automatically.

The script is idempotent—running it again will update existing resources rather than recreating them.

## Prerequisites

Before executing the script make sure you have:

- The [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed with beta components.
- Access to a Google Cloud project where you can manage IAM, Cloud SQL, and Cloud Run.
- `psql` and `python3` available locally (used for database bootstrapping and URL encoding).
- The HOAdoor repository cloned locally.
- Authentication in place via `gcloud auth login` and (if necessary) `gcloud auth application-default login`.

## Configure deployment variables

Create a file named `.env.gcp` in the repository root (or point the `ENV_FILE` environment variable at a different path). This file drives both infrastructure provisioning and runtime configuration. Lines should follow `KEY=value` format without surrounding quotes.

### Required keys

| Key | Description |
| --- | ----------- |
| `PROJECT_ID` | Google Cloud project ID where resources should be created. |
| `REGION` | Cloud Run & Cloud SQL region (for example `us-central1`). |
| `SERVICE_NAME` | Name for the Cloud Run service. |
| `SERVICE_ACCOUNT_NAME` | Name for the runtime service account (without the domain suffix). |
| `DB_INSTANCE` | Cloud SQL instance ID. |
| `DB_REGION` | Region for Cloud SQL (usually matches `REGION`). |
| `DB_TIER` | Machine type for Cloud SQL (e.g., `db-custom-2-7680`). |
| `DB_NAME` | Application database name. |
| `DB_USER` | Application database user. |
| `DB_PASSWORD` | Password for the application database user. |
| `POSTGRES_SUPERUSER_PASSWORD` | Password applied to the built-in `postgres` user (used to install extensions). |
| `SECRET_PREFIX` | Prefix applied to Secret Manager entries. |
| `NEXTAUTH_SECRET` | NextAuth signing secret (32+ random characters). |
| `NEXTAUTH_URL` | Public URL of your deployment (e.g., `https://app.example.com`). |
| SMTP keys (`EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD`, `EMAIL_FROM`) | Credentials for the SMTP provider powering magic-link emails. |

### Optional keys and defaults

| Key | Default | Purpose |
| --- | --- | --- |
| `PUBLIC_ENV_KEYS` | `NEXTAUTH_URL,EMAIL_SERVER_HOST,EMAIL_SERVER_PORT,EMAIL_FROM,EMAIL_SERVER_USER,EMAIL_FROM_NAME` | Comma-separated list of env vars that are safe to store as plain Cloud Run env vars instead of secrets. Remove entries here if you prefer to treat them as secrets. |
| `RUN_CPU` | `2` | vCPU allocation for both the service and the migration job. |
| `RUN_MEMORY` | `2Gi` | Memory allocation for service and migration job. |
| `RUN_TIMEOUT` | `600` | Request timeout in seconds. |
| `RUN_CONCURRENCY` | `80` | Maximum concurrent requests per instance. |
| `MAX_INSTANCES` | `4` | Max Cloud Run instances. |
| `MIN_INSTANCES` | `0` | Min Cloud Run instances. |
| `EXECUTION_ENVIRONMENT` | `gen2` | Cloud Run execution environment. |
| `ALLOW_UNAUTHENTICATED` | `true` | Set to `false` for private deployments. |
| `DB_BACKUP_START` | `02:00` | Automated backup start time (UTC). |
| `DB_MAINTENANCE_DAY` | `1` | Day of week for maintenance window (1 = Monday). |
| `DB_MAINTENANCE_HOUR` | `3` | Hour (UTC) for maintenance window. |
| `DB_AVAILABILITY_TYPE` | `ZONAL` | Change to `REGIONAL` for multi-zone Cloud SQL. |

### Example `.env.gcp`

```dotenv
# Deployment metadata
PROJECT_ID=my-hoadoor-project
REGION=us-central1
SERVICE_NAME=hoadoor-web
SERVICE_ACCOUNT_NAME=hoadoor-runner

# Cloud SQL
DB_INSTANCE=hoadoor-postgres
DB_REGION=us-central1
DB_TIER=db-custom-2-7680
DB_NAME=hoadoor
DB_USER=hoadoor_app
DB_PASSWORD=changeMe123!
POSTGRES_SUPERUSER_PASSWORD=changeMe123!
SECRET_PREFIX=hoadoor

# Runtime configuration
NEXTAUTH_URL=https://app.hoadoor.example
NEXTAUTH_SECRET=copy-a-32-byte-random-string-here
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=sg.your-api-key
EMAIL_FROM=noreply@hoadoor.example
```

> **Password tips:** The script URL-encodes the database user, password, and database name automatically, but sticking to alphanumeric characters plus `_-.!@` avoids unexpected quoting issues.

If you want to treat any of the values listed in `PUBLIC_ENV_KEYS` as secrets, remove them from the list; the script will then create Secret Manager entries and mount them securely.

## Run the deployment

1. Install dependencies and authenticate:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   gcloud config set project <your-project-id>
   ```

2. Execute the script from the repository root:
   ```bash
   ./scripts/deploy-gcp.sh
   ```

   Use the `ENV_FILE` environment variable if your config file lives elsewhere:
   ```bash
   ENV_FILE=./config/prod.env ./scripts/deploy-gcp.sh
   ```

3. The script outputs the Cloud Run service URL when finished. Visit the URL in your browser to confirm the site is live.

## What happens after deployment

- **Database migrations:** The script deploys and executes a Cloud Run job named `<service>-migrate` that runs `prisma migrate deploy`. You can rerun this job later when new migrations are added:
  ```bash
  gcloud run jobs execute <service>-migrate --region <region> --project <project-id> --wait
  ```

- **Secrets:** Each sensitive variable is stored as `<SECRET_PREFIX>-<env-name>` in Secret Manager. Update a value by adding a new secret version, then redeploy to pick it up.

- **Redeploying:** Re-run `./scripts/deploy-gcp.sh` after pushing new commits. Cloud Build will create a fresh container image and Cloud Run will roll out an updated revision.

- **Logs & monitoring:** Application logs flow into Cloud Logging under the service name. Use `gcloud run services logs read <service>` or the Cloud Console to inspect them.

## Clean up

When you no longer need the environment, delete resources to avoid charges:

```bash
gcloud run services delete <service> --region <region>
gcloud run jobs delete <service>-migrate --region <region>
gcloud sql instances delete <db-instance>
```

You can optionally remove the generated secrets and service account as well:

```bash
gcloud secrets delete <secret-name>
gcloud iam service-accounts delete <service-account>@<project-id>.iam.gserviceaccount.com
```

## Troubleshooting

- **Permission errors:** Ensure your user/service account has the `roles/owner` or the combination of `Cloud Run Admin`, `Cloud SQL Admin`, `Secret Manager Admin`, and `Artifact Registry Admin` roles.
- **Cloud SQL connection failures:** Confirm the Cloud Run service account has the `Cloud SQL Client` role and that the Cloud Run revision lists the Cloud SQL instance connection string.
- **Email delivery:** Provide production-ready SMTP credentials (SendGrid, Mailgun, etc.)—MailDev is for local development only.
- **Updating environment variables:** Modify `.env.gcp`, rerun the script, and the updated secrets/env vars will be applied on the next deployment.

Following this process gives you a reproducible, scriptable path for running HOAdoor on Google Cloud without managing Docker locally.
