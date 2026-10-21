import { describe, expect, it } from 'vitest';
import {
  apiResultSchema,
  registrationResultSchema,
  type RegistrationInput,
} from '@itqa/core';
import { MockRegistrationService } from './mock';

const base = {
  firstName: 'Ayesha',
  lastName: 'Aziz',
  email: 'ayesha@example.com',
  phone: '+123456789',
  dateOfBirth: '1990-01-01',
  gender: 'female',
  address: '1 Example Street',
  city: 'London',
  country: 'UK',
  consent: true,
} as const;

const khuddam: RegistrationInput = {
  ...base,
  track: 'khuddam',
  profession: 'Engineer',
  education: 'bachelor',
};

const envelope = apiResultSchema(registrationResultSchema);

describe('MockRegistrationService', () => {
  it('replays the same result for the same idempotency key', async () => {
    const service = new MockRegistrationService();
    const first = await service.submit(khuddam, 'key-1');
    const second = await service.submit(khuddam, 'key-1');

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(second.data.reference).toBe(first.data.reference);
    }
    expect(envelope.safeParse(first).success).toBe(true);
  });

  it('rejects a duplicate email for the same track', async () => {
    const service = new MockRegistrationService();
    await service.submit(khuddam, 'key-1');
    const duplicate = await service.submit(khuddam, 'key-2');

    expect(duplicate.ok).toBe(false);
    if (!duplicate.ok) {
      expect(duplicate.error.code).toBe('DUPLICATE');
    }
  });

  it('returns field errors for invalid input', async () => {
    const service = new MockRegistrationService();
    const result = await service.submit({ ...khuddam, consent: false }, 'key-3');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.fieldErrors?.consent).toBeTruthy();
    }
    expect(envelope.safeParse(result).success).toBe(true);
  });

  it('finds a stored registration by reference', async () => {
    const service = new MockRegistrationService();
    const created = await service.submit(khuddam, 'key-4');

    expect(created.ok).toBe(true);
    if (!created.ok) return;

    const found = await service.get(created.data.reference);
    expect(found.ok).toBe(true);
  });
});
