# Backend Handoff

The courses API is implemented in the separate
[`ITQASys/itqa-backend`](https://github.com/ITQASys/itqa-backend) repo. Registration
persistence is the next backend phase.

## Current backend (courses)

- Database: `itqa_backend`
- Endpoints: `GET /api/v1/courses`, `GET /api/v1/courses/sitemap`,
  `GET /api/v1/courses/{urlPath}`
- Shared contracts and fixtures: `@itqasys/core` / `@itqasys/core/fixtures`
- The frontend reads courses over HTTP via `BACKEND_API_URL`; it no longer reads
  the frontend `Course` table at runtime.

## Registration persistence (next)

The frontend is ready for a real backend without component changes. The only switch is
`REGISTRATION_API_MODE=live` plus `BACKEND_API_URL`.

1. `POST /registrations` and `GET /registrations/{reference}` per `docs/api-contract.md`.
2. Validate with `registrationSchema` / `REGISTRATION_SCHEMAS` from `@itqasys/core`.
3. Persist registrations in the same `itqa_backend` database:
   - unique `(track, normalizedEmail)`
   - `reference`, `track`, submitted payload, `submittedAt`, `status`, consent timestamp
   - course snapshot (`courseUrlPath`, `courseTitle`) and optional `courseId` relation
   - idempotency key + request hash + result, with a TTL or cleanup job
4. Map validation failures to `VALIDATION_ERROR` with `fieldErrors`.
5. Return `DUPLICATE` for the unique-constraint conflict.
6. Replace the in-memory rate limiter with a shared store (Redis) for multi-instance
   deployments. Keep the same limits unless product changes them.
7. Implement `POST /uploads/presign` with S3 presigned PUT URLs before any track adds a
   file field.
8. Restrict `GET /registrations/{reference}` if registrations become sensitive (for
   example, require the same email or a signed lookup token).

## Frontend switch

```env
REGISTRATION_API_MODE=live
BACKEND_API_URL=https://api.example.com/api/v1
```

`apps/frontend/lib/server/registrations/http.ts` forwards requests and normalizes the
envelope. Shape differences must be handled inside that adapter, never in components.

## Tests

- Run the contract test suite against the live adapter.
- Reuse `apps/frontend/lib/registrations/tracks.test.ts` so schema/content drift fails CI.
- Confirm idempotent replay and duplicate handling with real persistence.
- Reuse the shared `@itqasys/core/fixtures` registration fixture in backend contract tests.
