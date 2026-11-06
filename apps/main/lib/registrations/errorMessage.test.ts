import { describe, expect, it } from 'vitest';
import type { FormMessages } from '@itqasys/core/forms';
import { getRegistrationErrorMessage } from './errorMessage';

const messages: FormMessages = {
  successTitle: 'Success',
  successBody: 'Body',
  referenceLabel: 'Reference',
  duplicate: 'Duplicate registration.',
  rateLimited: 'Too many attempts.',
  validationError: 'Please check the form.',
  networkError: 'Network error.',
  submitting: 'Submitting',
  required: 'Required',
};

describe('getRegistrationErrorMessage', () => {
  it.each([
    ['DUPLICATE', 'Duplicate registration.'],
    ['RATE_LIMITED', 'Too many attempts.'],
    ['VALIDATION_ERROR', 'Please check the form.'],
  ] as const)('maps %s to its message', (code, expected) => {
    expect(getRegistrationErrorMessage(code, messages)).toBe(expected);
  });

  it('falls back to the network message for other codes', () => {
    expect(getRegistrationErrorMessage('SERVER_ERROR', messages)).toBe(
      'Network error.',
    );
  });
});
