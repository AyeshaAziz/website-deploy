import { describe, expect, it } from 'vitest';
import { validateRegistration } from './validate';

describe('validateRegistration', () => {
  it('accepts matching emails case-insensitively', () => {
    expect(
      validateRegistration({ email: 'Student@ITQA.org', confirmEmail: 'student@itqa.org' }),
    ).toBeUndefined();
  });

  it('reports mismatched emails on the confirmation field', () => {
    expect(
      validateRegistration({ email: 'one@itqa.org', confirmEmail: 'two@itqa.org' }),
    ).toEqual({ confirmEmail: 'Email addresses must match.' });
  });

  it('skips validation when email fields are missing or not strings', () => {
    expect(validateRegistration(null)).toBeUndefined();
    expect(validateRegistration({ email: 'one@itqa.org' })).toBeUndefined();
    expect(validateRegistration({ email: 1, confirmEmail: 2 })).toBeUndefined();
  });
});
