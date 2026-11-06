import { createServerSupabaseClient } from '@/utils/supabase/server';
import type { ApiResult, RegistrationResult, RegistrationTrack } from '@itqasys/core';
import {
  apiFailure,
  apiSuccess,
  registrationSchema,
} from '@itqasys/core';
import type { RegistrationService } from './service';

const REFERENCE_PREFIX: Record<RegistrationTrack, string> = {
  teacher: 'TCH',
  student: 'STU',
};

function createReference(track: RegistrationTrack): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `ITQA-${REFERENCE_PREFIX[track]}-${date}-${suffix}`;
}

function toRegistrationResult(row: {
  reference: string;
  track: string;
  submitted_at: string;
}): RegistrationResult {
  return {
    reference: row.reference,
    track: row.track as RegistrationTrack,
    submittedAt: row.submitted_at,
    status: 'RECEIVED',
  };
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

export class SupabaseRegistrationService implements RegistrationService {
  private getClient() {
    return createServerSupabaseClient();
  }

  async submit(input: unknown, idempotencyKey: string): Promise<ApiResult<RegistrationResult>> {
    const supabase = this.getClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiFailure('SERVER_ERROR', 'Authentication required.');
    }

    const parsed = registrationSchema.safeParse(input);
    if (!parsed.success) {
      return apiFailure('VALIDATION_ERROR', 'The registration could not be validated.', {
        fieldErrors: toFieldErrors(parsed.error.issues),
      });
    }

    const data = parsed.data;
    const email = data.email.trim().toLowerCase();
    const confirmEmail = data.confirmEmail.trim().toLowerCase();

    if (email !== confirmEmail) {
      return apiFailure('VALIDATION_ERROR', 'Email addresses must match.', {
        fieldErrors: { confirmEmail: 'Email addresses must match.' },
      });
    }

    if (!idempotencyKey) {
      return apiFailure('VALIDATION_ERROR', 'An Idempotency-Key header is required.');
    }

    const { data: existingByKey, error: keyError } = await supabase
      .from('registrations')
      .select('reference')
      .eq('idempotency_key', idempotencyKey)
      .maybeSingle();

    if (keyError) {
      return apiFailure('SERVER_ERROR', keyError.message);
    }

    if (existingByKey) {
      const { data: replay, error: replayError } = await supabase
        .from('registrations')
        .select('*')
        .eq('reference', existingByKey.reference)
        .single();

      if (replayError) {
        return apiFailure('SERVER_ERROR', replayError.message);
      }

      return apiSuccess(toRegistrationResult(replay));
    }

    const reference = createReference(data.track);
    const submittedAt = new Date().toISOString();

    const { error: insertError } = await supabase.from('registrations').insert({
      reference,
      user_id: user.id,
      track: data.track,
      aims_no: data.aimsNo,
      first_name: data.firstName,
      last_name: data.lastName,
      tanzeem: data.tanzeem,
      country: data.country,
      city: data.city,
      phone: data.phone,
      email,
      course: data.course,
      course_language: data.courseLanguage,
      second_language: data.secondLanguage,
      teaching_experience: (data as { teachingExperience?: string }).teachingExperience,
      teaching_role: (data as { role?: string }).role,
      commit_days: (data as { commitDays?: string[] }).commitDays,
      available_times: (data as { availableTimes?: string[] }).availableTimes,
      idempotency_key: idempotencyKey,
      submitted_at: submittedAt,
    });

    if (insertError) {
      if (insertError.code === '23505') {
        const { data: replay, error: replayError } = await supabase
          .from('registrations')
          .select('*')
          .eq('idempotency_key', idempotencyKey)
          .maybeSingle();

        if (!replayError && replay) {
          return apiSuccess(toRegistrationResult(replay));
        }
      }
      return apiFailure('SERVER_ERROR', insertError.message);
    }

    const result: RegistrationResult = {
      reference,
      track: data.track,
      submittedAt,
      status: 'RECEIVED',
    };

    return apiSuccess(result);
  }

  async get(reference: string): Promise<ApiResult<RegistrationResult>> {
    const supabase = this.getClient();

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('reference', reference)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return apiFailure('NOT_FOUND', 'Registration not found.');
      }
      return apiFailure('SERVER_ERROR', error.message);
    }

    return apiSuccess({
      reference: data.reference,
      track: data.track as RegistrationTrack,
      submittedAt: data.submitted_at,
      status: 'RECEIVED',
    });
  }
}