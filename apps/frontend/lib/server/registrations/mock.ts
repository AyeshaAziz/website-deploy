import {
  apiFailure,
  apiSuccess,
  registrationSchema,
  type ApiResult,
  type RegistrationResult,
  type RegistrationTrack,
} from '@itqa/core';
import type { RegistrationService } from './service';

const REFERENCE_PREFIX: Record<RegistrationTrack, string> = {
  atfalNasirat: 'ATN',
  ansar: 'ANS',
  khuddam: 'KHD',
  lajna: 'LJN',
  teacher: 'TCH',
};

function createReference(track: RegistrationTrack): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `ITQA-${REFERENCE_PREFIX[track]}-${date}-${suffix}`;
}

function toFieldErrors(
  issues: Array<{ path: Array<string | number>; message: string }>,
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.join('.') || 'form';
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}

export class MockRegistrationService implements RegistrationService {
  private readonly byReference = new Map<string, RegistrationResult>();
  private readonly byIdempotencyKey = new Map<string, RegistrationResult>();
  private readonly byIdentity = new Map<string, string>();

  async submit(input: unknown, idempotencyKey: string): Promise<ApiResult<RegistrationResult>> {
    const parsed = registrationSchema.safeParse(input);
    if (!parsed.success) {
      return apiFailure('VALIDATION_ERROR', 'The registration could not be validated.', {
        fieldErrors: toFieldErrors(parsed.error.issues),
      });
    }

    if (!idempotencyKey) {
      return apiFailure('VALIDATION_ERROR', 'An Idempotency-Key header is required.');
    }

    const replay = this.byIdempotencyKey.get(idempotencyKey);
    if (replay) return apiSuccess(replay);

    const data = parsed.data;
    const identity = `${data.track}:${data.email.toLowerCase()}`;
    if (this.byIdentity.has(identity)) {
      return apiFailure('DUPLICATE', 'A registration already exists for this email address.', {
        fieldErrors: { email: 'This email is already registered for this track.' },
      });
    }

    const result: RegistrationResult = {
      reference: createReference(data.track),
      track: data.track,
      submittedAt: new Date().toISOString(),
      status: 'RECEIVED',
    };

    this.byReference.set(result.reference, result);
    this.byIdempotencyKey.set(idempotencyKey, result);
    this.byIdentity.set(identity, result.reference);

    return apiSuccess(result);
  }

  async get(reference: string): Promise<ApiResult<RegistrationResult>> {
    const result = this.byReference.get(reference);
    if (!result) {
      return apiFailure('SERVER_ERROR', 'Registration not found.');
    }
    return apiSuccess(result);
  }
}
