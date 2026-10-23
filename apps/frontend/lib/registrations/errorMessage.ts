import type { ApiErrorCode } from '@itqa/core';
import type { FormMessages } from '@itqa/core/forms';

export function getRegistrationErrorMessage(
  code: ApiErrorCode,
  messages: FormMessages,
): string {
  switch (code) {
    case 'DUPLICATE':
      return messages.duplicate;
    case 'RATE_LIMITED':
      return messages.rateLimited;
    case 'VALIDATION_ERROR':
      return messages.validationError;
    default:
      return messages.networkError;
  }
}
