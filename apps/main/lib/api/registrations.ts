import type { ApiResult, RegistrationInput, RegistrationResult } from '@itqasys/core';
import { apiFetch } from './client';

export function submitRegistration(
  input: RegistrationInput,
  idempotencyKey: string,
): Promise<ApiResult<RegistrationResult>> {
  return apiFetch<RegistrationResult>('/registrations', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(input),
  });
}

export function getRegistration(
  reference: string,
): Promise<ApiResult<RegistrationResult>> {
  return apiFetch<RegistrationResult>(`/registrations/${encodeURIComponent(reference)}`);
}
