import type { ApiResult, RegistrationResult } from '@itqasys/core';

export interface RegistrationService {
  submit(input: unknown, idempotencyKey: string): Promise<ApiResult<RegistrationResult>>;
  get(reference: string): Promise<ApiResult<RegistrationResult>>;
}
