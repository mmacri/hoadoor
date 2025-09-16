# HOAdoor Agent Operations Guide

This repository is production-ready. Treat it as the canonical implementation of the HOAdoor platform. All contributors **must** follow the guidance in this file in addition to system/developer/user instructions.

## 1. Required References
Consult these documents before touching code or copy:
- `PID.md` – product strategy, personas, required capabilities.
- `UI_DESIGN.md` – visual system, spacing scale, typography, component expectations.
- `ARCHITECTURE.md` – system layout, technology stack, data model.
- `RBAC.md` – role hierarchy and permissions that must be enforced in UI and API layers.
- `API_REFERENCE.md` – endpoint contracts and validation rules.
- `SELF_CHECK.md` – the 13 success criteria already delivered; keep this in sync when functionality changes.
- `README.md` / `PRIVACY_POLICY.md` – setup instructions and legal copy that must stay accurate.

## 2. System Overview
- Framework: **Next.js 14 App Router** with React 18, TypeScript, and shadcn/ui.
- Styling: Tailwind CSS using the design tokens and spacing scale in `UI_DESIGN.md`.
- Data: PostgreSQL via Prisma; migrations live in `/prisma/migrations`, seed data in `prisma/seed.ts`.
- Auth: NextAuth magic-link provider. Sessions and roles are persisted in the database.
- Rate limiting, RBAC, validation, and business logic live under `src/server` and `src/lib`.
- Testing: Vitest (unit), Playwright (E2E), ESLint, TypeScript, and Prettier formatting.

### Directory Map
| Path | Purpose |
| ---- | ------- |
| `src/app` | App Router pages, layouts, API routes, and global styles. |
| `src/components` | Reusable React components, including UI primitives under `components/ui`. |
| `src/lib` | Utilities (validation schemas, analytics helpers, formatting). |
| `src/server` | Server-side logic: Prisma queries, RBAC helpers, rate limiting. |
| `prisma/` | Schema, seeds, and migration history. |
| `tests/` | Vitest unit/integration suites and Playwright specs. |

## 3. Platform Surface Areas
Maintain parity with the shipped feature set:
1. **Public discovery** – searchable HOA directory with advanced filters and SEO-friendly pages.
2. **HOA profiles** – rating breakdowns, amenities, reviews, admin responses, join CTA.
3. **Reviews** – CRUD with anonymous posting, verification, helpful votes, and rate limiting.
4. **Authenticated user tools** – dashboards, watchlists, membership tracking, notification settings.
5. **Private community portal** – forums, documents, events, directories, messaging restricted to approved members.
6. **HOA admin capabilities** – member approval, moderation, announcements, analytics, profile management.
7. **Platform admin console** – global moderation, HOA verification, user suspension, audit trail.

When expanding features, keep flows consistent with `PID.md` personas and journeys.

## 4. Implementation Rules
- **Validation & Security**: Every API route must use Zod schemas (`src/lib/validations`) and check RBAC permissions (`src/server/permissions`). Respect the documented rate limits.
- **Database Work**: Update `prisma/schema.prisma`, generate migrations, and refresh seed data when models change. Keep indexes aligned with search and analytics needs.
- **UI/UX**: Use Inter font, Tailwind spacing scale (4px base), and the color palette from `UI_DESIGN.md`. Use shadcn/ui primitives and Lucide icons; pair icons with visible labels for accessibility.
- **Accessibility**: Maintain WCAG 2.1 AA compliance—semantic HTML, proper aria attributes, visible focus states, keyboard operability.
- **State & Forms**: Use `react-hook-form` with `@hookform/resolvers/zod` for form handling. Handle optimistic UI carefully and surface loading/skeleton states defined in `UI_DESIGN.md`.
- **Internationalization & Copy**: Keep tone professional yet approachable. Plain language, actionable errors, and inclusive content.
- **Documentation**: Update relevant markdown (README, API_REFERENCE, SELF_CHECK, etc.) whenever behavior, endpoints, or flows change.

## 5. Environment & Tooling
1. **Dependencies**: `npm install` currently fails because `@radix-ui/react-badge` is not published. Remove that dependency (the project ships its own badge in `src/components/ui/badge.tsx`) before installing packages and do not reintroduce it.
2. **Local setup**:
   ```bash
   npm install
   npm run db:up
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```
   Maildev runs at http://localhost:1080 for magic link emails.
3. **Database maintenance**: `npm run db:down` tears down Docker services. Use `npm run db:migrate:reset` when schema changes require a clean slate.

## 6. Quality Gates
Run these commands (and fix failures) before committing:
```bash
npm run lint
npm run type-check
npm run test
npm run build
```
Execute Playwright E2E tests (`npm run test:e2e`) when you touch flows covered by them. Keep husky/lint-staged configuration intact.

## 7. Success Criteria & Regression Guardrails
The twelve (plus documentation) success criteria enumerated in `SELF_CHECK.md` are non-negotiable. Any change must preserve:
- Working public search and HOA detail experiences.
- Verified review lifecycle with moderation and aggregation.
- Membership gating, community content, and RBAC enforcement.
- Admin tooling (HOA and platform) and associated auditability.
- Comprehensive automated test coverage and CI readiness.
If new functionality extends these areas, append to `SELF_CHECK.md` with verification steps.

## 8. Change Management Checklist
Before opening a PR or finishing a task:
- Confirm new work aligns with PID goals and UI guidelines.
- Add or update Prisma migrations/seeds as needed.
- Provide tests covering new logic (unit + integration/E2E where relevant).
- Update documentation (README, API_REFERENCE, SELF_CHECK, changelog) to reflect behavior.
- Capture accessibility and responsive behavior for UI changes (screenshots when practical).
- Ensure `git status` is clean and all quality gates pass.

Following this guide keeps HOAdoor consistent, accessible, and production-ready.
