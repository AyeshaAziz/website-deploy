import { apiFailure, type ApiResult, type RegistrationResult } from '@itqa/core';
import type { RegistrationService } from './service';

function isApiResult(value: unknown): value is ApiResult<RegistrationResult> {
  return typeof value === 'object' && value !== null && 'ok' in value;
}

export class HttpRegistrationService implements RegistrationService {
  constructor(private readonly baseUrl: string) {}

  submit(input: unknown, idempotencyKey: string): Promise<ApiResult<RegistrationResult>> {
    return this.request('/registrations', {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(input),
    });
  }

  get(reference: string): Promise<ApiResult<RegistrationResult>> {
    return this.request(`/registrations/${encodeURIComponent(reference)}`);
  }

  private async request(
    path: string,
    init: RequestInit = {},
  ): Promise<ApiResult<RegistrationResult>> {
    if (!this.baseUrl) {
      return apiFailure('SERVER_ERROR', 'BACKEND_API_URL is not configured.');
    }

    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

    try {
      const response = await fetch(`${this.baseUrl.replace(/\/$/, '')}${path}`, {
        ...init,
        headers,
      });
      const payload: unknown = await response.json().catch(() => null);

      if (isApiResult(payload)) return payload;

      return apiFailure('SERVER_ERROR', `Backend returned status ${response.status}.`);
    } catch {
      return apiFailure('SERVER_ERROR', 'The registration service is unavailable.');
    }
  }
}
