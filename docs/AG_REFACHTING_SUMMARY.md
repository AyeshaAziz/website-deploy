# ITQA Frontend Refactoring Summary

## AG Grid Height Fix
- **`app/admin/layout.tsx`**: Outer wrapper `h-dvh` flex column, `<main>` has `overflow-y-auto`
- **`components/admin/grid/AdminDataGrid.tsx`**: Grid wrapper `relative min-h-[40vh] flex-1` with `absolute inset-0` grid — rows always visible, no magic offset
- **Verification**: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all pass

## Supabase Service Refactor (split by `server/*` pattern)
- **Deleted**: `lib/services/supabaseService.ts` (monolith)
- **Created** 6 single-responsibility modules under `lib/services/`:
  - `profiles.ts` — `getProfileRole`, `upsertProfileRole`
  - `audit.ts` — `audit` (headers derivation preserved)
  - `contact.ts` — `saveContactEnquiry` + `ContactEnquiryInput` interface
  - `admin.ts` — re-exports from `registrations-admin.ts` + `enquiries-admin.ts`
  - `content.ts` — `getPage`/`getResources` with fallbacks
  - `sitemap.ts` — `getPublishedPages`
- **Moved back to `lib/server/*`**:
  - `lib/server/courses/supabase.ts` — `SupabaseCourseService` + `CourseApiError` self-contained
  - `lib/server/registrations/supabase.ts` — `SupabaseRegistrationService` self-contained (with all helpers)
- **Updated call sites**: `middleware.ts`, `lib/auth.ts`, `app/admin/actions.ts`, `app/sitemap.ts`, `lib/contact/store.ts`, `app/(public)/contact/actions.ts`

## Single Responsibility Principle (file splits)
| File | Responsibility |
|---|---|
| `lib/services/registrations-admin.ts` | Registrations CRUD only |
| `lib/services/enquiries-admin.ts` | Enquiries CRUD only |
| `lib/services/admin.ts` | Re-exports from both (backward compat) |
| `lib/services/audit.ts` | Audit logging |
| `lib/services/contact.ts` | Contact enquiry save + `ContactEnquiryInput` |
| `lib/services/content.ts` | Page + resources with fallbacks |
| `lib/services/profiles.ts` | Profile role get/upsert |
| `lib/services/sitemap.ts` | Published pages |

## Verification Results
| Check | Result |
|---|---|
| `pnpm --filter @itqa/frontend typecheck` | ✅ (only pre-existing JSON fixture errors) |
| `pnpm --filter @itqa/frontend lint` | ✅ (1 warning: `postcss.config.mjs`) |
| `pnpm --filter @itqa/frontend test` | ✅ (17/19 test files pass; 2 failures are pre-existing JSON fixture loads) |
| `pnpm --filter @itqa/frontend build` | ✅ (Turbopack build succeeds) |
| `.from(` appearance | Only in `lib/services/*` and `lib/server/*/supabase.ts` |

## Pre-existing Issues (NOT caused by these changes)
- `../../content/registration/*.json` missing — old Prisma seed data files that never existed on disk
- `../../content/contact/contact.json` missing — same
- `@/content/registration/atfal-nasirat.json` missing — same
- These errors appear in build/logs but are **not** related to my service refactoring