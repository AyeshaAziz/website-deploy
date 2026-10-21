import { apiFailure, type ApiResult } from '@itqa/core';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1';
const DEFAULT_TIMEOUT_MS = 15_000;

export interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiFetch<T>(
  path: string,
  { timeoutMs = DEFAULT_TIMEOUT_MS, ...init }: ApiFetchOptions = {},
): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    });
    const payload: unknown = await response.json().catch(() => null);

    if (payload && typeof payload === 'object' && 'ok' in payload) {
      return payload as ApiResult<T>;
    }

    return apiFailure('SERVER_ERROR', `Unexpected response (${response.status}).`);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return apiFailure('SERVER_ERROR', 'The request timed out.');
    }
    return apiFailure('SERVER_ERROR', 'The server could not be reached.');
  } finally {
    clearTimeout(timeout);
  }
}
