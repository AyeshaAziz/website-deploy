import { describe, expect, it } from 'vitest';
import { REGISTRATION_SCHEMAS, registrationSchema } from './schemas';
import { REGISTRATION_TRACKS } from './tracks';

describe('registration schemas', () => {
  it('provides one schema per track', () => {
    expect(Object.keys(REGISTRATION_SCHEMAS)).toEqual([...REGISTRATION_TRACKS]);
  });

  it('only includes teaching experience on the teacher schema', () => {
    expect('teachingExperience' in REGISTRATION_SCHEMAS.student.shape).toBe(false);
    expect('teachingExperience' in REGISTRATION_SCHEMAS.teacher.shape).toBe(true);
  });

  it('requires consent and validates the discriminated union', () => {
    const result = registrationSchema.safeParse({
      track: 'teacher',
      aimsNo: 'AIMS-12345',
      firstName: 'A',
      lastName: 'B',
      tanzeem: 'khuddam',
      country: 'Country',
      city: 'City',
      phone: '+123456789',
      email: 'a@example.com',
      confirmEmail: 'a@example.com',
      teachingExperience: '3 years',
      course: 'naziratul-quran',
      courseLanguage: 'English',
      consent: false,
    });

    expect(result.success).toBe(false);
  });
});
