import { describe, expect, it } from 'vitest';
import { COURSE_FIXTURES, REGISTRATION_FIXTURES } from './index';
import { courseDtoSchema } from '../model/courses';
import { registrationSchema } from '../model/registration/schemas';

describe('shared fixtures', () => {
  it('contains valid course fixtures', () => {
    for (const course of COURSE_FIXTURES) {
      expect(courseDtoSchema.safeParse(course).success).toBe(true);
    }
  });

  it('contains valid registration fixtures', () => {
    for (const registration of Object.values(REGISTRATION_FIXTURES)) {
      expect(registrationSchema.safeParse(registration).success).toBe(true);
    }
  });
});
