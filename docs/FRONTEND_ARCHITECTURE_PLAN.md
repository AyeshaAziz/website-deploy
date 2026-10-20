# Frontend Architecture Plan: Core/UI Split and Backend-Ready Registration

Status: Approved for implementation
Scope: `@itqa/core`, `@itqa/ui`, `@itqa/website`, `@itqa/frontend`

## 1. Goals

- Rename `@itqa/shared` to `@itqa/core` (contracts, design tokens, utils, form model).
- Create `@itqa/ui`, a shared library for all generic React components.
- Build registration forms frontend-first, with no backend, without rework when the backend arrives.
- Keep the code modular and follow SOLID where practical.
- Keep hard-coded data in JSON files.
- Use the shared component library for reusable form UI.
- Make the form engine generic and domain-agnostic.
- Do not create a separate forms package or repository.

## 2. Confirmed decisions

| Decision | Choice |
| --- | --- |
| Contracts and design tokens | `@itqa/core` in `packages/core` |
| Generic components | `@itqa/ui` in `packages/ui` |
| Website composition | `@itqa/website` in `packages/website` |
| Form state and validation | `react-hook-form` + `@hookform/resolvers/zod` |
| Form field source of truth | zod schema; JSON holds labels/options/copy only |
| Transport seam | Next.js BFF route handlers under `/api/v1` |
| Backend integration | Mock service adapter now; HTTP adapter later |
| Uploads | Supported by the form engine and contract, not used in v1 |
| Storybook | Moved to `@itqa/ui` |
| Existing primitive imports | Updated to `@itqa/ui`; no re-exports from `@itqa/website` |

## 3. Target topology

```
apps/frontend              @itqa/frontend   pages, registration content/json, API seam, BFF
packages/website           @itqa/website    site composition (Header, Subheader, Footer, About/CMS sections, Banner)
packages/ui                @itqa/ui         all generic React components + generic form engine
packages/core              @itqa/core       contracts (zod/DTOs), design tokens, utils, form model (NO React)
```

Dependency direction, with no cycles:

```
core <- ui <- website <- frontend
```

### 3.1 Forms are not a package

Forms are split by concern:

- `@itqa/core/forms`: `FormConfig`, `FieldConfig`, content schema, `createFormConfig(schema, content)`, and the `f()` metadata helper. Framework-agnostic and server-safe.
- `@itqa/ui/forms`: `Form`, `FieldWrapper`, field renderers, renderer registry, and upload adapter. React and react-hook-form only.

`@itqa/ui` root exports primitives only. The `./forms` subpath is separate so importing a Button never pulls react-hook-form.

## 4. What moves where

### 4.1 Into `@itqa/core` (renamed from `packages/shared`)

- `src/design/*` (unchanged)
- `src/model/*`
- Root types and constants
- `cn` and `str`
- New `src/model/registration/*` contracts
- New `src/forms/*` form model and schema-to-config generation

The root barrel must remain React-free. Subpath exports: `.`, `./design`, `./forms`.

### 4.2 Into `@itqa/ui` (new `packages/ui`)

Move from `packages/website/src/ui/`:

- `Badge`
- `Button`
- `Card`
- `ChevronDown`
- `Container`
- `field`
- `Input`
- `Label`
- `NavBar`
- `NavBarMobile`
- `SectionHeading`
- `Select`
- `Textarea`
- Their `.stories.tsx` files

Add `src/forms/`:

- `Form`, `FieldWrapper`
- `field-renderers/*`
- `field-renderer-registry`
- `upload-adapter`

Exports: `.` for primitives (no react-hook-form) and `./forms` for the client-only form engine.

### 4.3 Stays in `@itqa/website`

- `layout/header/Header.tsx`
- `layout/header/Subheader.tsx`
- `layout/footer/*`
- `sections/about/*`
- `sections/Sections.tsx`
- `sections/BannerSlideshow.tsx`

These import primitives from `@itqa/ui` and types from `@itqa/core`.

## 5. Phase 1: Rename `@itqa/shared` to `@itqa/core`

### Tasks

- Rename directory `packages/shared` to `packages/core`.
- Update `package.json`:
  - name to `@itqa/core`
  - add `zod` dependency
  - exports: `.`, `./design`, `./forms`
  - keep React out of the package
- Update dependencies:
  - `apps/frontend/package.json:14`
  - `packages/website/package.json:18`
- Update imports (approximately 22 files), including:
  - `apps/frontend/components/SiteHeader.tsx:5`
  - `apps/frontend/lib/content.ts:49`
  - `apps/frontend/lib/auth.ts:4`
  - `apps/frontend/app/admin/actions.ts:8`
  - `packages/website/src/layout/header/Header.tsx:4`
  - `packages/website/src/layout/header/Subheader.tsx:2`
  - `packages/website/src/ui/NavBar.tsx:4`
  - `packages/website/src/ui/NavBarMobile.tsx:3`
  - `packages/website/src/sections/Sections.tsx:2-3`
  - `packages/website/src/sections/BannerSlideshow.tsx:4`
  - All files in `packages/website/src/ui/`
- Update configuration:
  - `apps/frontend/next.config.mjs:37`
  - `apps/frontend/tailwind.config.ts:11` and content glob at `:16`
  - `packages/website/tailwind.config.ts:11`
- Update documentation:
  - `README.md:28`
  - `DESIGN_SYSTEM.md:10,19,20,32,200`
  - `ITQA_Design_Tokens_and_Screen_Map.md:28,97,113,143`
- Run `pnpm install` to refresh the lockfile.

### Verification

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

## 6. Phase 2: Create `@itqa/ui` and move generic components

### Tasks

- Create `packages/ui` with `package.json`, `tsconfig.json`, tailwind config, postcss config, and Storybook.
- Move the generic components and stories listed in section 4.2.
- Update imports inside moved files from `@itqa/shared` to `@itqa/core`.
- Delete `packages/website/src/ui/`.
- Remove `export * from './ui'` from `packages/website/src/index.ts`.
- Update `@itqa/website` internals to import from `@itqa/ui`:
  - `Header.tsx`, `Subheader.tsx`: Container, NavBar, MobileNav
  - `Sections.tsx`: ButtonLink, Card, Container, SectionHeading
  - `sections/about/*`: Container
  - `layout/footer/*`: Container
- Update frontend imports (no re-exports):
  - `app/(public)/contact/page.tsx:2`
  - `app/admin/login/page.tsx:1`
  - `app/admin/content-management/[slug]/page.tsx:4`
  - `app/admin/content-management/page.tsx:2`
  - `app/(public)/courses/page.tsx:2`
  - `app/(public)/courses/[slug]/page.tsx:3`
- Keep `Header`, `Footer`, `AboutSections`, `WebsiteLanding`, and `BannerSlideshow` on `@itqa/website`.

### Package wiring

`@itqa/ui`:

- dependencies: `@itqa/core`, `react-hook-form`, `@hookform/resolvers`, `zod`
- peerDependencies: `react`, `react-dom`
- exports: `.` (primitives) and `./forms`

`@itqa/website`:

- dependencies: `@itqa/core`, `@itqa/ui`

`@itqa/frontend`:

- dependencies: `@itqa/core`, `@itqa/ui`, `@itqa/website`

Next.js and Tailwind:

- Add `@itqa/core` and `@itqa/ui` to `transpilePackages` in `apps/frontend/next.config.mjs`.
- Add `packages/core/src` and `packages/ui/src` to Tailwind content globs in the frontend and Storybook configs.

### Storybook

- Move `.storybook/`, `preview.css`, and `postcss.config.mjs` to `packages/ui`.
- Add `packages/ui/tailwind.config.ts`.
- Story globs in `main.ts`:
  - `../src/**/*.stories.@(ts|tsx)`
  - `../../website/src/**/*.stories.@(ts|tsx)` for the two section story files.
- Keep `@storybook/react-vite` available to `@itqa/website` for story typings.
- Update root scripts `storybook` and `build-storybook` to target `@itqa/ui`.

### Verification

- `pnpm typecheck`
- `pnpm build`
- `pnpm build-storybook`

## 7. Phase 3: Generic form layers

### 7.1 `@itqa/core/forms`

Files:

- `types.ts`: `FormConfig`, `FieldConfig`, `FieldType`, `FormMessages`
- `field-meta.ts`: `f(schema, meta)` using `.describe(JSON.stringify(meta))`
- `content-schema.ts`: zod schema for JSON content
- `create-config.ts`: schema-to-config generation
- Unit tests, no React

`create-config.ts` behavior:

- Iterate `schema.shape`.
- Read `FieldMeta` from `.describe()`.
- Derive `required` from `!field.isOptional()`.
- Resolve labels, placeholders, and help text from JSON by field name.
- Map option values from metadata to labels in JSON.
- Sort fields by `meta.order`.
- Throw a descriptive error if metadata or a label is missing.

### 7.2 `@itqa/ui/forms`

Files:

- `types.ts`: `FieldRenderer`, `FieldRendererProps`
- `field-renderer-registry.ts`
- `field-renderers/*`: text, email, tel, number, date, textarea, select, radio, checkbox, file
- `FieldWrapper.tsx`: label, required marker, help text, error, `aria-describedby`, `aria-invalid`
- `Form.tsx`: `'use client'`, react-hook-form + zodResolver, server `fieldErrors` via `setError`, submit and disabled state
- `upload-adapter.ts`: interface and context; file renderer supported but unused in v1
- Tests with jsdom and testing-library

Client boundary rule: build the config inside the client component. Never pass a zod schema from a server component across the RSC boundary.

## 8. Phase 4: Registration feature

### 8.1 Content JSON

`apps/frontend/content/registration/`:

- `atfal-nasirat.json`
- `ansar.json`
- `khuddam.json`
- `lajna.json`
- `teacher.json`
- `messages.json`

Each track JSON holds labels, placeholders, option labels, and copy only:

```json
{
  "title": "Student Registration - Atfal/Nasirat",
  "description": "...",
  "submitLabel": "Submit registration",
  "fields": {
    "firstName": { "label": "First name", "placeholder": "..." }
  },
  "options": {
    "gender": { "male": "Male", "female": "Female" }
  },
  "messages": { "successTitle": "...", "successBody": "..." }
}
```

### 8.2 Contracts

`packages/core/src/model/registration/`:

- `tracks.ts`: `REGISTRATION_TRACKS`
- `field.ts` or `field-meta.ts`: the `f()` metadata helper
- `schemas.ts`: one schema per track and a discriminated union on `track`
- `response.ts`: `ApiResult<T>` envelope, error codes, `RegistrationResult`, optional `documents`
- Conventions: camelCase JSON, ISO-8601 UTC dates, string IDs, optional `locale`

Error codes:

- `VALIDATION_ERROR`
- `DUPLICATE`
- `RATE_LIMITED`
- `SERVER_ERROR`

### 8.3 Track registry

`apps/frontend/lib/registrations/tracks.ts`:

- Map `RegistrationTrack` to `{ schema, content }`.
- Expose `getFormConfig(track)` which calls `createFormConfig`.
- Adding a track requires: a schema, a JSON file, and one registry entry.

### 8.4 API seam

- `apps/frontend/lib/api/client.ts`: `apiFetch<T>()` against `/api/v1`, timeout/abort, error normalization.
- `apps/frontend/lib/api/registrations.ts`: `submitRegistration`, `getRegistration`.
- `apps/frontend/lib/server/registrations/service.ts`: `RegistrationService` interface.
- `apps/frontend/lib/server/registrations/mock.ts`: shared-schema validation, in-memory idempotency map, generated reference; dev-only.
- `apps/frontend/lib/server/registrations/http.ts`: forwards to `BACKEND_API_URL` when `REGISTRATION_API_MODE=live`.
- `apps/frontend/lib/server/registrations/factory.ts`: the only composition root.
- Route handlers:
  - `app/api/v1/registrations/route.ts` (POST)
  - `app/api/v1/registrations/[reference]/route.ts` (GET)
  - `app/api/v1/uploads/presign/route.ts` (mock, unused in v1)
  - `app/api/v1/health/route.ts`
- Idempotency: client generates `crypto.randomUUID()` per submission and sends it as `Idempotency-Key`; retries reuse it.
- Reuse the in-memory `lib/rate-limit.ts` for now; Redis is a later TODO.

### 8.5 UI and routes

- `apps/frontend/components/registration/RegistrationForm.tsx`:
  - resolves config from the track registry
  - wires `@itqa/ui/forms` `Form` to `submitRegistration`
  - renders success, duplicate, rate-limited, and network states
  - maps `fieldErrors` with `setError`
  - disables double submit and manages focus
- Pages matching existing nav hrefs:
  - `app/(public)/atfalNasirat/page.tsx`
  - `app/(public)/ansar/page.tsx`
  - `app/(public)/khuddam/page.tsx`
  - `app/(public)/lajna/page.tsx`
  - `app/(public)/teachersReg/page.tsx`
- `generateMetadata` reads title and description from the same JSON.
- Consent/privacy checkbox is part of the schema and JSON.

## 9. Phase 5: Tests, documentation, verification

### Tests

- Core:
  - config generation
  - metadata parsing
  - option-label resolution
  - schema fixtures
- UI:
  - renderer registry
  - form validation, submit, and error states
  - accessibility attributes
- Frontend:
  - mock service idempotency and duplicates
  - config-to-schema alignment: every schema field has content and vice versa
  - registration form states
- Contract test: every mock response parses with the shared response schema.

### Documentation

- `docs/api-contract.md`
- `BACKEND_TODO.md`
- `.env.example`:
  - `REGISTRATION_API_MODE=mock`
  - `BACKEND_API_URL`
  - `NEXT_PUBLIC_API_BASE_URL=/api/v1`
- Update `README.md` package table.
- Update `DESIGN_SYSTEM.md` paths.

### Verification commands

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm build-storybook
```

## 10. SOLID mapping

| Principle | Application |
| --- | --- |
| Single Responsibility | core holds contracts; ui renders; website composes; frontend wires transport |
| Open/Closed | new track = schema + JSON + registry entry; new field type = renderer + registry entry |
| Liskov Substitution | all field renderers implement the same `FieldRenderer` contract |
| Interface Segregation | small interfaces: `FieldRenderer`, `RegistrationService`, `UploadAdapter` |
| Dependency Inversion | form engine depends on injected `onSubmit` and renderer registry; feature depends on `RegistrationService`; factory selects mock/http |

## 11. Acceptance criteria

- Zero `@itqa/shared` references remain.
- No `@itqa/forms` package exists.
- `packages/website/src/ui` is removed.
- `@itqa/core` root is React-free.
- `@itqa/ui` imports only `@itqa/core` and React libraries, never website or frontend.
- Frontend imports generic components from `@itqa/ui` and site composition from `@itqa/website`.
- Adding a track requires no engine changes.
- Adding a field type requires only a renderer and registry entry.
- No component contains field lists, option lists, or literal copy.
- All verification commands pass.

## 12. Commit sequence

1. Rename core, update imports/configs/docs, install.
2. Extract `@itqa/ui`, update website/frontend imports, move Storybook.
3. Add core form model and UI form engine with tests.
4. Add registration content, contracts, API seam, mock, BFF, and routes with tests.
5. Update documentation and run full verification.

## 13. Risks and tradeoffs

- Renaming touches every package import. Keep it as its own commit so failures are easy to isolate.
- Moving Storybook requires cross-package story globs and careful dependency placement.
- Schema-derived config relies on `.describe()` metadata. Keep the convention small and tested; avoid other private zod internals.
- Putting React in `@itqa/core` is deliberately avoided via the core/ui split.
- The mock service is in-memory and resets on restart. It is for development only, not production persistence.

## 14. Backend handoff

1. Backend implements `docs/api-contract.md`.
2. Implement `http.ts` and set `REGISTRATION_API_MODE=live`.
3. Run contract tests against the live adapter.
4. Map any backend shape differences inside the adapter only; never in components.
