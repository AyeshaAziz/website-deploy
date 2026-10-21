# Backend Handoff

The frontend is ready for a real backend without component changes. The only switch is
`REGISTRATION_API_MODE=live` plus `BACKEND_API_URL`.

## Implement

1. `POST /registrations` and `GET /registrations/{reference}` per `docs/api-contract.md`.
2. Validate with `registrationSchema` / `REGISTRATION_SCHEMAS` from `@itqa/core`.
3. Persist registrations in Postgres:
   - unique `(track, normalizedEmail)`
   - `reference`, `track`, submitted payload, `submittedAt`, `status`, consent timestamp
   - idempotency key + result, with a TTL or cleanup job
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
BACKEND_API_URL=https://api.example.com
```

`apps/frontend/lib/server/registrations/http.ts` forwards requests and normalizes the
envelope. Shape differences must be handled inside that adapter, never in components.

## Tests

- Run the contract test suite against the live adapter.
- Reuse `apps/frontend/lib/registrations/tracks.test.ts` so schema/content drift fails CI.
- Confirm idempotent replay and duplicate handling with real persistence.
