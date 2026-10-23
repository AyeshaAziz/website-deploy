# ITQA Website

Website-only scope from the ITQA Architecture Design Document: public pages plus a database-driven CMS.
No portals, no Express backend, no Redis yet. Layout matches the full platform monorepo so Phase 3 adds to it.

## Quick start

```bash
corepack enable            # or: npm i -g pnpm
pnpm install
cp .env.example .env       # then set JWT_SECRET (32+ chars)
pnpm db:up                 # Postgres 15 via Docker
pnpm db:push               # create tables
pnpm db:seed               # admin editor, sample pages, courses
pnpm dev                   # http://localhost:3000
```

If you see `Namespace ... has no exported member` errors, the Prisma client was not generated (newer pnpm skips install scripts): run `pnpm --filter @itqa/database generate`.

Editor login: http://localhost:3000/admin/login (credentials from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).

## Layout

| Path | Purpose |
| --- | --- |
| `apps/frontend` | Next.js 16 app: public routes, registration pages, `/admin` CMS, BFF API, server actions, middleware |
| `packages/website` | `@itqa/website`: header/footer, section components, page renderer |
| `packages/ui` | `@itqa/ui`: generic React components, Storybook, generic form engine (`@itqa/ui/forms`) |
| `packages/core` | `@itqa/core`: contracts, design tokens, utils, form model (`@itqa/core/forms`) |
| `packages/database` | `@itqa/database`: Prisma schema, client, seed (reused by Express later) |
| `infra/terraform` | AWS base (media bucket done; VPC, RDS, ALB, compute TODO) |
| `.github/workflows` | CI: install, db push, seed, lint, typecheck, test, build |

## What works

- ISR public pages: Home, any CMS page (`/about`, `/study-materials`), Courses list and detail, Contact form (department routing, validation, honeypot, rate limit; email delivery pending SES)
- Registration forms for Students and Teachers, driven by `@itqa/core` schemas and JSON copy, with a `/api/v1` BFF, idempotency, duplicate handling and rate limits
- Editor login (bcrypt + signed JWT cookie), role check in every server action, audit log on every change
- Draft / publish with on-demand revalidation; sitemap.xml and robots.txt; security headers

## Registration API

The forms call the Next.js BFF at `/api/v1`. In development the BFF uses an in-memory
mock (resets on restart); no backend is required.

```env
REGISTRATION_API_MODE=mock   # or "live"
BACKEND_API_URL=             # required when live
NEXT_PUBLIC_API_BASE_URL=/api/v1
```

See `docs/api-contract.md` for the contract and `BACKEND_TODO.md` for the handoff. Each
track is one schema (`packages/core`), one JSON file (`apps/frontend/content/registration`),
and one registry entry (`apps/frontend/lib/registrations/tracks.ts`).

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm build-storybook
```

Storybook lives in `packages/ui` (`pnpm storybook`).

## Stubbed or TODO (maps to the plan steps)

- Step 2: design tokens in `tailwind.config.ts`, real wireframes, RTL/i18n decision
- Step 3: Terraform VPC/RDS/ALB/compute, deploy job in CI, S3 remote state
- Step 4: Contact email via SES, structured data, Open Graph images, real copy
- Step 5: typed section forms, Tiptap rich text, dnd-kit ordering, S3 image upload, Course/Resource editors
- Step 6: CSP with nonces, WordPress content migration and 301 redirects, load test
- Registration backend: replace the mock adapter with the live API (`BACKEND_TODO.md`), shared Redis rate limiting, S3 uploads
- Auth is a minimal JWT cookie; `requireAuth`/`requireRole` in `apps/frontend/lib/auth.ts` is the interface to keep if you move to Auth.js.
