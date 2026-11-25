# ITQA Website

Website-only scope from the ITQA Architecture Design Document: public pages plus a database-driven CMS.
The courses API lives in the separate [`ITQASys/itqa-backend`](https://github.com/ITQASys/itqa-backend) repo;
registration persistence will be added there later. No portals or Redis yet. Layout matches the full
platform monorepo so Phase 3 adds to it.

## Quick start

```bash
corepack enable            # or: npm i -g pnpm
pnpm install
cp .env.example .env       # then set JWT_SECRET (32+ chars)
pnpm db:up                 # Postgres 15 via Docker
pnpm db:deploy             # apply migrations
pnpm db:seed               # admin editor and sample pages
pnpm dev                   # http://localhost:3000
```

If you see `Namespace ... has no exported member` errors, the Prisma client was not generated (newer pnpm skips install scripts): run `pnpm --filter @itqa/database generate`.

Editor login: http://localhost:3000/admin/login (credentials from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).

## Layout

| Path | Purpose |
| --- | --- |
| `src` | Next.js 16 app: public routes, registration pages, `/admin` CMS, BFF API, server actions, middleware |
| `packages/website` | `@itqa/website`: header/footer, section components, page renderer |
| `packages/ui` | `@itqa/ui`: generic React components, Storybook, generic form engine (`@itqa/ui/forms`) |
| `packages/core` | `@itqasys/core`: contracts, design tokens, utils, form model (`@itqasys/core/forms`) |
| `packages/database` | `@itqa/database`: CMS Prisma schema, client, seed |
| `infra/terraform` | AWS base (media bucket done; VPC, RDS, ALB, compute TODO) |
| `.github/workflows` | CI: install, migrations, seed, lint, typecheck, test, build |

## What works

- ISR public pages: Home, any CMS page (`/about`, `/study-materials`), Courses list and detail, Contact form (department routing, validation, honeypot, rate limit; email delivery pending SES)
- Registration forms for Students and Teachers, driven by `@itqasys/core` schemas and JSON copy, with a `/api/v1` BFF, idempotency, duplicate handling and rate limits
- Editor login (bcrypt + signed JWT cookie), role check in every server action, audit log on every change
- Draft / publish with on-demand revalidation; sitemap.xml and robots.txt; security headers

## Courses API

Course data is served by the separate backend repo. Start it on port 4000 and point the
frontend at it:

```bash
# terminal 1 (D:\ITQA\itqa-backend)
pnpm install
pnpm db:deploy
pnpm db:seed
pnpm dev

# terminal 2
pnpm dev
```

```env
BACKEND_API_URL=http://localhost:4000/api/v1
```

The home page renders without courses if the API is unavailable. `/courses`, course
detail, and registration pages use the public error boundary instead.

## Shared package

`@itqasys/core` is published to GitHub Packages for the backend repo. Bump the version,
then run the **Publish core** workflow manually; it uses `GITHUB_TOKEN` with
`packages: write`. Backend CI needs a `PACKAGES_TOKEN` secret with `read:packages`.

## Registration API

The forms call the Next.js BFF at `/api/v1`. In development the BFF uses an in-memory
mock (resets on restart); no backend is required for registration yet.

```env
REGISTRATION_API_MODE=mock   # or "live"
BACKEND_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_API_BASE_URL=/api/v1
```

See `docs/api-contract.md` for the contract and `BACKEND_TODO.md` for the handoff. Each
track is one schema (`packages/core`), one JSON file (`src/content/registration`),
and one registry entry (`src/lib/registrations/tracks.ts`).

## Deploying to Vercel

This is a pnpm monorepo, so the Vercel project's **Root Directory must be `apps/main`**.
`apps/main/vercel.json` then sets the Next.js preset, build command, and `.next` output
directory. Set the app's environment variables in the Vercel project settings; `.env`
files are not committed.

`public` is the Next.js static-assets folder, not a build output. A Vercel build that
looks for `public` or a root-level `.next` means the Root Directory is still the repo
root. Change it in **Settings → Build and Deployment → Root Directory** and redeploy.

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
- Auth is a minimal JWT cookie; `requireAuth`/`requireRole` in `src/lib/auth.ts` is the interface to keep if you move to Auth.js.
