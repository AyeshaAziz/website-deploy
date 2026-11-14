# Registration Submit Test Plan

## Confirmed bug

Anonymous submit is rejected before validation:

- `apps/main/lib/server/registrations/supabase.ts:57` returns `SERVER_ERROR` / `"Authentication required."`
- `apps/main/lib/registrations/errorMessage.ts:15` maps that to the generic `networkError` copy.
- Verified: anonymous `POST /api/v1/registrations` → `502`; authenticated student and teacher submits → `201`.

Per the chosen direction, this plan keeps the login requirement and adds a clear message. No middleware/auth changes.

---

## Phase 0 — Make the tests runnable

The repo has per-package Vitest configs, but root `pnpm test` does not discover them. Also `apps/main/vitest.config.ts:7` points `@` at `src`, which does not exist.

1. Add root `vitest.workspace.ts`:
   ```ts
   import { defineWorkspace } from 'vitest/config';
   export default defineWorkspace(['apps/main', 'packages/core', 'packages/ui']);
   ```
2. Fix `apps/main/vitest.config.ts`:
   - alias `@` → `./` (not `src`)
   - `esbuild: { jsx: 'automatic' }`
   - `environmentMatchGlobs: [['**/*.test.tsx', 'jsdom']]`
3. Add `jsdom` and `@testing-library/react` to `apps/main` devDependencies. This needs approval per `AGENTS.md` §10. No `jest-dom` needed for the hook test.
4. When adding `authRequired` to `FormMessages`, update every fixture that constructs messages:
   - `apps/main/lib/registrations/tracks.ts:56`
   - `apps/main/lib/registrations/errorMessage.test.ts:5`
   - `packages/core/src/forms/create-config.test.ts:7`
   - `packages/ui/src/forms/Form.test.tsx:27` and `:118`
5. Do not edit `content-data/**` or `messages.json`; they are not wired up (`tracks.ts:19` imports `messagesJson` but never uses it).

---

## Phase 1 — Test matrix

### 1. Service unit test

`apps/main/lib/server/registrations/supabase.test.ts`

Mock `@/utils/supabase/server`. Cases:

- anonymous user + valid payload → `AUTH_REQUIRED`, no insert
- anonymous user + invalid payload → still `AUTH_REQUIRED` (auth runs before schema validation)
- authenticated student → success, insert uses `user_id` and camelCase → snake_case mapping
- authenticated teacher → insert includes `teaching_role`, `commit_days`, `available_times`
- duplicate idempotency key → replay original reference, no insert
- key lookup error → `SERVER_ERROR`
- replay query error → `SERVER_ERROR`
- 23505 race with found row → success replay
- 23505 with no row / non-23505 → `SERVER_ERROR`
- invalid payload → `VALIDATION_ERROR` + field errors; union-level failure uses key `form`
- `get()`: `PGRST116` → `NOT_FOUND`; other error → `SERVER_ERROR`

Implementation notes:

- `getClient()` runs before `auth.getUser()`, so the mock must return a client even for anonymous tests.
- `createReference` uses `new Date()` and `crypto.randomUUID()`; use `vi.setSystemTime` + stub UUID, or assert `^ITQA-(STU|TCH)-\d{8}-[A-Z0-9]{6}$`.
- Student inserts include teacher keys with `undefined`; use `toEqual`, not `toStrictEqual`.
- The manual email-mismatch branch at `supabase.ts:72` is unreachable because `registrationSchema` already refines it; test it as a schema validation case.

### 2. API route test

`apps/main/app/api/v1/registrations/route.test.ts`

Mock `@/lib/server/registrations/factory` and `@/lib/rate-limit`.

- missing `Idempotency-Key` → `400`
- service returns `AUTH_REQUIRED` → `401`
- success → `201`
- `VALIDATION_ERROR` → `400`
- `DUPLICATE` → `409`
- `RATE_LIMITED` → `429`
- `SERVER_ERROR` → `502`
- rate limiter false → `429` and service is not called
- malformed JSON → `400`
- service throws → `502`
- rate-limit key uses first `x-forwarded-for` value, falls back to `registration:unknown`

Note: replay currently returns `201`, not `200`.

### 3. Error mapper

Extend `apps/main/lib/registrations/errorMessage.test.ts`:

- `getRegistrationErrorMessage('AUTH_REQUIRED', messages)` returns `messages.authRequired`
- existing mappings remain unchanged

### 4. Client hook test

`apps/main/components/registration/form/useRegistrationForm.test.tsx`

Mock `@/lib/api/registrations`.

- `AUTH_REQUIRED` result → `state.status === 'error'` with the sign-in copy
- success result → `state.status === 'success'` with the reference
- field-error result → `fieldErrors` set and error message set
- passing `validateRegistration` with mismatched emails → `fieldErrors` set, `submitRegistration` not called
- two submits reuse the same idempotency key
- a new submit clears previous `fieldErrors`
- `submitRegistration` receives `{ ...values, track }`

Use `await act(async () => { await result.current.handleSubmit(values); })`.

### 5. API client test

`apps/main/lib/api/registrations.test.ts`

- `submitRegistration` calls `POST /registrations`
- sends `Idempotency-Key`
- preserves `AUTH_REQUIRED` envelope unchanged through `apiFetch`

### 6. Related schema tests

Extend existing files, do not duplicate:

- `packages/core/src/model/registration/schemas.test.ts` — `role` accepts `support-teacher` and `assistant-teacher`
- `apps/main/lib/registrations/tracks.test.ts` — role options match the schema enum values

This catches the current drift: `common.json:64-68` defines three roles, but `schemas.ts:86` only allows `main-teacher`.

---

## Phase 2 — Production changes these tests will drive

Switch to build mode for these:

1. Add `AUTH_REQUIRED` to `API_ERROR_CODES` in `packages/core/src/model/registration/response.ts`. This is a shared public API change and needs approval.
2. `statusFor` maps `AUTH_REQUIRED` → `401`.
3. `SupabaseRegistrationService.submit` returns:
   ```ts
   apiFailure('AUTH_REQUIRED', 'Please sign in to register.')
   ```
4. Add `authRequired` to `FormMessages` and `formMessagesSchema`.
5. Add `authRequired` copy in `tracks.ts:56`.
6. Map `AUTH_REQUIRED` in `getRegistrationErrorMessage`.
7. Update `docs/api-contract.md:32-40` and `:67-103` to document the session requirement and new code.

Optional related fixes:

- Widen role enum to all three content values.
- Reconcile `supabase-migrations.sql` with the live DB columns `teaching_role`, `commit_days`, `available_times`.

---

## Phase 3 — Verification

```bash
pnpm test
pnpm --filter @itqa/main typecheck
pnpm --filter @itqasys/core typecheck
pnpm --filter @itqa/main lint
```

Run `pnpm build` only after asking, because a dev server is currently listening on port 3000.

Pre-existing unrelated failure: `apps/main/lib/contact/departments.test.ts` expects five departments but receives one.

---

## Approvals needed before implementation

- Add `jsdom` + `@testing-library/react` to `apps/main`.
- Add `AUTH_REQUIRED` to the shared API error enum.
- Decide whether to include the role-enum and migration fixes in the same change.
