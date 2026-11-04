import { describe, expect, it } from 'vitest';
import { REGISTRATION_SCHEMAS, registrationSchema } from './schemas';
import { REGISTRATION_TRACKS } from './tracks';

describe('registration schemas', () => {
  it('provides one schema per track', () => {
    expect(Object.keys(REGISTRATION_SCHEMAS)).toEqual([...REGISTRATION_TRACKS]);
  });

  it('only includes teacher-only fields on the teacher schema', () => {
    for (const field of ['teachingExperience', 'role', 'commitDays', 'availableTimes']) {
      expect(field in REGISTRATION_SCHEMAS.student.shape).toBe(false);
      expect(field in REGISTRATION_SCHEMAS.teacher.shape).toBe(true);
    }
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
      teachingExperience: 'over-one-year',
      role: 'main-teacher',
      commitDays: ['monday'],
      availableTimes: ['09:00'],
      course: 'naziratul-quran',
      courseLanguage: 'English',
      consent: false,
    });

    expect(result.success).toBe(false);
  });

  it('requires the confirmation email to match', () => {
    const result = registrationSchema.safeParse({
      track: 'student',
      aimsNo: 'AIMS-12345',
      firstName: 'A',
      lastName: 'B',
      tanzeem: 'khuddam',
      country: 'Country',
      city: 'City',
      phone: '+123456789',
      email: 'a@example.com',
      confirmEmail: 'b@example.com',
      course: 'naziratul-quran',
      courseLanguage: 'English',
      consent: true,
    });

    expect(result.success).toBe(false);
  });

  const validTeacher = {
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
    teachingExperience: 'over-one-year',
    role: 'main-teacher',
    commitDays: ['monday', 'tuesday'],
    availableTimes: ['09:00', '16:00'],
    course: 'naziratul-quran',
    courseLanguage: 'English',
    consent: true,
  };

  it('accepts a fully valid teacher registration', () => {
    expect(registrationSchema.safeParse(validTeacher).success).toBe(true);
  });

  it('requires the teacher-only fields', () => {
    for (const field of ['teachingExperience', 'role', 'commitDays', 'availableTimes']) {
      const result = registrationSchema.safeParse({ ...validTeacher, [field]: undefined });
      expect(result.success, field).toBe(false);
    }
  });

  it('rejects unknown commit day values', () => {
    const result = registrationSchema.safeParse({
      ...validTeacher,
      commitDays: ['friday'],
    });

    expect(result.success).toBe(false);
  });

  it('rejects an empty commitDays or availableTimes array', () => {
    expect(registrationSchema.safeParse({ ...validTeacher, commitDays: [] }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...validTeacher, availableTimes: [] }).success).toBe(
      false,
    );
  });
});
