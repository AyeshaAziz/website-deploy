# AGENTS.md — ITQA Website

> **Read this file at the start of every task and follow it.** If a user request
> conflicts with these rules, explain the conflict and ask before proceeding.
> The goal is safe, predictable, modular changes that match the existing codebase.

## 0. Critical Rules — Must Follow

### Responses

- Keep responses concise and to the point unless the user asks otherwise.

### Planning Mode

- Always ask clarifying questions.
- Never assume design, tech stack, or features.
- Use deep-dive sub-agents to assist with research.
- Use deep-dive sub-agents to review the different aspects of the plan before
  presenting it to the user.

### Change / Edit Mode

- Never implement features yourself when avoidable — use sub-agents.
- Identify plan changes that can be implemented in parallel and delegate them to
  sub-agents efficiently.
- When sub-agents implement features, act as coordinator only.
- Use the best model for the task: premium models for complex work (e.g.
  coding), mid-tier models for simpler work (e.g. documentation).
- After completing features (large or small), always run lint, typecheck, and
  build to verify code quality (see §8).

### Database Schema Changes

- This project uses **Prisma**, not Drizzle.
- After any schema change, always run generate and migrate:
  `pnpm --filter @itqa/database generate` then
  `pnpm --filter @itqa/database db:migrate`.
- **Never** run `prisma db push` (including `pnpm db:push`).

### Testing

- Use the testing tools, libraries, and scripts the project provides.
- Never assume changes simply work — always test.
- If no testing tools, scripts, MCP tools, or skills are available, ask the user
  whether testing should be skipped.

### UI Design

- Always follow the UI design system when creating or reviewing components or
  pages.
- Design system: `DESIGN_SYSTEM.md` (tokens: `packages/core/src/design/tokens.ts`).

## 1. Project Overview

ITQA (International Ta'limul Qur'an Academy) public website plus CMS and
registration foundations.

| Area | Stack |
| --- | --- |
| Monorepo | pnpm workspaces, TypeScript strict |
| App | Next.js 16 App Router, React 19, Server Components first |
| Styling | Tailwind CSS 3, design tokens from `@itqa/core/design` |
| Data | Prisma 5 + PostgreSQL, CMS-driven pages (`WebsitePage` / `Section`) |
| UI preview | Storybook 10 (`packages/ui`, stories for `packages/website`) |
| Tests | Vitest, Testing Library |
| Deploy | Docker/AWS (`infra/terraform`), not fully wired yet |

## 2. Non-Negotiable Rules

- **[Ctx] Inspect before editing.** Read the relevant files and follow existing
  patterns. Never assume a library, script, or convention exists.
- Follow SOLID and DRY principles where possible
- **[SF] Simplicity first.** Choose the smallest solution that fully solves the
  problem. No speculative abstractions.
- **[RP] Readability first.** Code must be understandable without a walkthrough.
- **[DM] Dependency minimalism.** Do not add a package without asking first.
- **[SecF] Security first.** Validate external input, never log or commit
  secrets, always check auth/roles on privileged paths.
- **[Mod] Modularity.** One responsibility per file. Split code into small,
  focused files instead of growing large ones (see §4).
- **[Plan] Plan multi-step work.** Use a todo list for 3+ steps. Ask before
  schema changes, migrations, destructive commands, or public API changes.
- **[Verify] Verify before finishing.** Run the smallest relevant checks, then
  the full checks when required (see §8).
- **[Commit] Never commit, amend, push, or open a PR unless explicitly asked.**

## 3. Repository Map

```text
apps/frontend/                 Next.js app (public site, admin, API routes)
  app/(public)/                Public pages
  app/admin/                   CMS admin
  app/api/v1/                  API route handlers
  components/                  App-only components
  content/                     Static app fallback content (contact, registration)
  lib/                         Server/data/auth helpers
packages/core/                 Shared contracts, DTOs, tokens, form schemas
packages/database/             Prisma schema, client singleton, seed
packages/ui/                   Reusable primitives + generic form engine
packages/website/              Header/footer, page sections, website components
infra/terraform/               AWS infrastructure
docs/                          Architecture and API contracts
```

Import direction: apps may import packages; packages must not import apps.
`@itqa/core` must not depend on Prisma, React, or Next.js.

## 4. Modularity & File Size

- **One reason to change per file.** A file should have one clear responsibility.
- **Soft limit: ~200 lines. Hard limit: ~300 lines** for hand-written code.
  Split before hitting the hard limit.
- **One primary component per file.** Co-locate its styles/types/helpers only if
  they are truly private to it.
- **Each website section lives in its own folder**, e.g.
  `packages/website/src/sections/courses/FeaturedCourses.tsx`, with an
  `index.ts`. `SectionRenderer.tsx` should only map section types to components
  and `PageView.tsx` should only map page sections.
- **Client components are leaves.** Add `'use client'` only to the smallest
  interactive component, never to a page/layout that could stay server-side.
- **Types and contracts live in `@itqa/core`** when shared across packages.
- **Tests and stories live beside the code** (`X.test.tsx`, `X.stories.tsx`).
- **Avoid barrel-file sprawl.** Barrels belong at package entrypoints, not as a
  layer for every folder.
- **Prefer small pure functions** in separate files over large utility modules.
- **No copy-paste duplication.** Extract a shared component/helper when the
  same behavior appears a second time.

## 5. Coding Conventions

### TypeScript

- Strict mode is on. Do not weaken `tsconfig`.
- **Never use `any`.** Use `unknown` + narrowing, generics, or proper types.
- Exported functions/components should have explicit return types where the
  inference is not obvious (`: ReactNode`, `: Promise<PageDTO | null>`).
- Use `import type` for type-only imports.
- Prefer `const`; avoid `let` unless reassignment is required.

### React / Next.js

- Server Components by default. Use Client Components only for state, events,
  effects, or browser APIs.
- Use the App Router conventions already in the repo (`page.tsx`, `layout.tsx`,
  `route.ts`, Server Actions).
- Use `@/...` alias imports inside `apps/frontend`.
- Keep data fetching in `apps/frontend/lib/**` or Server Components; do not
  fetch in presentational components.
- Use Next.js `Metadata` exports for page titles/descriptions.

### Naming & Exports

- Components: `PascalCase` (`CourseCard`, `SectionRenderer`).
- Files: match the primary export (`CourseCard.tsx`).
- Functions/variables: `camelCase` with auxiliaries (`isLoading`, `hasDb`).
- Constants: `UPPER_SNAKE_CASE` for true constants.
- **Named exports by default.** Use default exports only where Next.js requires
  them (`page.tsx`, `layout.tsx`, `error.tsx`, config files).

### Styling

- Use Tailwind utilities. **No inline `style` objects** unless a computed value
  cannot be expressed otherwise.
- **Never hardcode colors, fonts, spacing, radii, or shadows.** Import tokens
  from `@itqa/core/design` or use the generated Tailwind classes
  (`bg-primary-5`, `text-h3`, `shadow-card`).
- Typography uses **Cabin** for all Latin text (body, headings, UI) through
  `font-sans` / `font-cabin` / `font-heading`; Arabic/RTL text uses
  `font-arabic` (Amiri). Never hardcode fonts.
- Use `cn()` from `@itqa/core` for conditional classes.
- Match the existing responsive approach: mobile-first, `sm/md/lg` breakpoints.
- Use semantic HTML and accessible names. Interactive elements must be real
  `<button>`/`<a>` elements and keyboard accessible.
- Prefer `next/image` for new raster images when practical; existing components
  may use `<img>` for static public assets. Always provide `alt` (decorative
  images use `alt=""`).

### Comments & Documentation

- Comments explain **why**, not what.
- Do not add banner comments or commented-out code.
- Update `DESIGN_SYSTEM.md` / design docs when changing tokens or shared UI.
- Update `README.md` / `docs/` when changing commands, setup, or public APIs.

## 6. Data, CMS & Design System

- Access the database through `@itqa/database` only.
- `packages/database/src/index.ts` should export Prisma **explicitly**
  (`export { Prisma } ...`), not `export *` (avoids the CJS external warning).
- Keep Prisma out of frontend-only mode: `apps/frontend/lib/content.ts` imports
  it dynamically and falls back to static content when the DB is unavailable.
- All DTOs used by pages belong in `@itqa/core` (`PageDTO`, `SectionDTO`,
  `CourseDTO`, `ResourceDTO`).
- Section types are `HOME`, `TEXT`, `FEATURED_COURSES`, `MULTIMEDIA`,
  `FEATURED_RESOURCES`, `CTA`. Renaming or adding one requires updating together:
  `packages/core/src/index.ts`, `packages/database/prisma/schema.prisma`,
  `SectionRenderer`, seed data, Storybook stories, and docs.
- Seed scripts must be idempotent: use `upsert`; never duplicate rows on rerun.
- App-only static fallback content belongs in `apps/frontend/content/`. Data
  shared with the database seed lives in `@itqa/core` (e.g.
  `FALLBACK_COURSES`) so there is one source of truth.
- Design tokens have one source of truth: `packages/core/src/design/tokens.ts`.
  If a CSS variable changes, update both `tokens.ts` and
  `apps/frontend/app/globals.css`.
- Course images live in `apps/frontend/public/images/courses/` and use stable
  slugs (`naziratul-quran.png`, etc.). Replace placeholders with real assets,
  do not add one-off paths.
- Multimedia videos come from the ITQA YouTube channel feed in
  `apps/frontend/lib/youtube.ts` (`getChannelVideos`), plumbed through
  `SectionData.videos`. The playlist row is the merged ITQA event playlists
  (Jalsa talks + annual award ceremony) via `getPlaylistVideos` /
  `EVENT_PLAYLIST_IDS`, plumbed through `SectionData.playlist`.
  `packages/website/src/sections/multimedia/media.json` is the offline/static
  fallback for both.
- All carousels use the shared `Carousel` API
  (`packages/website/src/sections/shared/carousel/`): `fade`, `scroll`, and
  `playlist` variants. Add behavior there, not in individual sections.

## 7. Security

- Validate all untrusted input with Zod at the boundary (forms, API routes,
  Server Actions).
- Enforce authentication and roles on admin/server actions before any mutation.
- Use Prisma’s parameterized API; never build raw SQL from user input.
- Validate upload type/size and generate server-side keys for storage.
- Never commit `.env`, credentials, tokens, or keys.
- Never log secrets, passwords, or full request bodies.
- Do not reveal internal errors to clients; return safe messages.
- Keep security headers in `next.config.mjs` intact.

## 8. Testing & Verification

### During development (file-scoped first)

```bash
# Type check one package/file
pnpm --filter @itqa/frontend typecheck
pnpm --filter @itqa/website typecheck
node node_modules/typescript/bin/tsc -p <package>/tsconfig.json --noEmit

# Lint changed frontend files
pnpm --filter @itqa/frontend exec eslint app/path/file.tsx lib/file.ts

# Run one test
pnpm --filter @itqa/frontend exec vitest run path/to/file.test.ts
pnpm --filter @itqa/core exec vitest run src/path/file.test.ts
```

### Before finishing (full checks)

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build          # ask first if a dev server is running
```

Windows/PowerShell note: if the `pnpm` shim is unavailable, run the underlying
tool directly, e.g. `node node_modules/typescript/bin/tsc -p apps/frontend/tsconfig.json --noEmit`.
Do not silently skip verification.

### Definition of Done

- [ ] Behavior matches the request; edge cases handled.
- [ ] Existing patterns followed; no duplicate logic.
- [ ] Files remain small and focused.
- [ ] Types are correct; no `any`.
- [ ] Security/auth/validation reviewed.
- [ ] Relevant typecheck, lint, tests, and build pass.
- [ ] Docs updated when behavior/tokens/structure changed.
- [ ] No unrelated files changed; no secrets committed.

## 9. Workflow

1. **Read this file** and inspect the relevant code first.
2. **Clarify ambiguity** with a short question when a request is ambiguous or
   could affect data, schema, or public behavior.
3. **Plan** multi-step work with a todo list.
4. **Implement in small increments**, keeping the code modular.
5. **Verify** with the narrowest checks, then full checks.
6. **Report** what changed, where, and what was verified, using
   `file:line` references.

## 10. Ask First

Stop and ask before:

- Changing Prisma schema, enums, migrations, or seed behavior that alters data.
- Adding/removing dependencies.
- Deleting files, data, or rewriting unrelated code.
- Changing shared package APIs or design tokens.
- Force-pushing, rebasing, committing, or opening PRs.
- Running expensive project-wide commands while a dev server/build is active.

## 11. Known Gotchas

- `apps/frontend` is the only package with an ESLint config today.
- `packages/website` has no lint script; use its `typecheck`.
- Next 16 warns that `middleware` is deprecated in favor of `proxy`; do not
  rename it without an explicit task.
- The database may be down during frontend-only work; static fallbacks in
  `lib/content.ts` must keep the site renderable.
- Do not reintroduce `export * from '@prisma/client'` in
  `packages/database/src/index.ts`.
- Do not hardcode the five course cards in the page; they come from
  `getCourses()` with `FALLBACK_COURSES` from `@itqa/core` as the no-DB fallback.
