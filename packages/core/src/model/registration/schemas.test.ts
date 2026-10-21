import { describe, expect, it } from 'vitest';
import { REGISTRATION_SCHEMAS, registrationSchema } from './schemas';
import { REGISTRATION_TRACKS } from './tracks';

describe('registration schemas', () => {
  it('provides one schema per track', () => {
    expect(Object.keys(REGISTRATION_SCHEMAS)).toEqual([...REGISTRATION_TRACKS]);
  });

  it('requires consent and validates the discriminated union', () => {
    const result = registrationSchema.safeParse({
      track: 'khuddam',
      firstName: 'A',
      lastName: 'B',
      email: 'a@example.com',
      phone: '+123456789',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: '1 Street',
      city: 'City',
      country: 'Country',
      profession: 'Engineer',
      education: 'bachelor',
      consent: false,
    });

    expect(result.success).toBe(false);
  });
});
