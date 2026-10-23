import { describe, expect, it } from 'vitest';
import {
  apiResultSchema,
  registrationResultSchema,
  type RegistrationInput,
} from '@itqa/core';
import { MockRegistrationService } from './mock';

const base = {
  aimsNo: 'AIMS-12345',
  firstName: 'Ayesha',
  lastName: 'Aziz',
  tanzeem: 'lajna',
  country: 'UK',
  city: 'London',
  phone: '+123456789',
  email: 'ayesha@example.com',
  confirmEmail: 'ayesha@example.com',
  teachingExperience: '3 years',
  course: 'naziratul-quran',
  courseLanguage: 'English',
  consent: true,
} as const;

const teacher: RegistrationInput = {
  ...base,
  track: 'teacher',
};

const student: RegistrationInput = {
  ...base,
  track: 'student',
  email: 'student@example.com',
  confirmEmail: 'student@example.com',
};

const envelope = apiResultSchema(registrationResultSchema);

describe('MockRegistrationService', () => {
  it('replays the same result for the same idempotency key', async () => {
    const service = new MockRegistrationService();
    const first = await service.submit(teacher, 'key-1');
    const second = await service.submit(teacher, 'key-1');

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(second.data.reference).toBe(first.data.reference);
    }
    expect(envelope.safeParse(first).success).toBe(true);
  });

  it('rejects a duplicate email for the same track', async () => {
    const service = new MockRegistrationService();
    await service.submit(teacher, 'key-1');
    const duplicate = await service.submit(teacher, 'key-2');

    expect(duplicate.ok).toBe(false);
    if (!duplicate.ok) {
      expect(duplicate.error.code).toBe('DUPLICATE');
    }
  });

  it('returns field errors for invalid input', async () => {
    const service = new MockRegistrationService();
    const result = await service.submit({ ...teacher, consent: false }, 'key-3');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.fieldErrors?.consent).toBeTruthy();
    }
    expect(envelope.safeParse(result).success).toBe(true);
  });

  it('accepts a valid student registration', async () => {
    const service = new MockRegistrationService();
    const result = await service.submit(student, 'key-5');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.track).toBe('student');
      expect(result.data.reference).toContain('ITQA-STU-');
    }
  });

  it('rejects a student registration with mismatched confirmEmail', async () => {
    const service = new MockRegistrationService();
    const result = await service.submit(
      { ...student, confirmEmail: 'other@example.com' },
      'key-6',
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.fieldErrors?.confirmEmail).toBeTruthy();
    }
    expect(envelope.safeParse(result).success).toBe(true);
  });

  it('finds a stored registration by reference', async () => {
    const service = new MockRegistrationService();
    const created = await service.submit(teacher, 'key-4');

    expect(created.ok).toBe(true);
    if (!created.ok) return;

    const found = await service.get(created.data.reference);
    expect(found.ok).toBe(true);
  });
});
