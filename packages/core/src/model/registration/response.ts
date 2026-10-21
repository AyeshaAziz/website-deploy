import { z } from 'zod';
import { REGISTRATION_TRACKS } from './tracks';

export const API_ERROR_CODES = [
  'VALIDATION_ERROR',
  'DUPLICATE',
  'RATE_LIMITED',
  'SERVER_ERROR',
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  fieldErrors?: Record<string, string>;
  retryAfterSeconds?: number;
}

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: ApiError;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export interface RegistrationDocument {
  id: string;
  name: string;
  url: string;
  contentType: string;
  size: number;
}

export interface RegistrationResult {
  reference: string;
  track: (typeof REGISTRATION_TRACKS)[number];
  submittedAt: string;
  status: 'RECEIVED';
  documents?: RegistrationDocument[];
}

export const apiErrorCodeSchema = z.enum(API_ERROR_CODES);

export const apiErrorSchema = z.object({
  code: apiErrorCodeSchema,
  message: z.string(),
  fieldErrors: z.record(z.string()).optional(),
  retryAfterSeconds: z.number().nonnegative().optional(),
});

export const registrationDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  contentType: z.string(),
  size: z.number().nonnegative(),
});

export const registrationResultSchema = z.object({
  reference: z.string(),
  track: z.enum(REGISTRATION_TRACKS),
  submittedAt: z.string(),
  status: z.literal('RECEIVED'),
  documents: z.array(registrationDocumentSchema).optional(),
});

export function apiSuccess<T>(data: T): ApiSuccess<T> {
  return { ok: true, data };
}

export function apiFailure(
  code: ApiErrorCode,
  message: string,
  extra: Omit<ApiError, 'code' | 'message'> = {},
): ApiFailure {
  return { ok: false, error: { code, message, ...extra } };
}

export function apiResultSchema<T extends z.ZodTypeAny>(data: T) {
  return z.discriminatedUnion('ok', [
    z.object({ ok: z.literal(true), data }),
    z.object({ ok: z.literal(false), error: apiErrorSchema }),
  ]);
}
