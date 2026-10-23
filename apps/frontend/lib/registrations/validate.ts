const EMAIL_MISMATCH = 'Email addresses must match.';

export function validateRegistration(
  values: unknown,
): Record<string, string> | undefined {
  if (typeof values !== 'object' || values === null) return undefined;

  const { email, confirmEmail } = values as {
    email?: unknown;
    confirmEmail?: unknown;
  };

  if (typeof email !== 'string' || typeof confirmEmail !== 'string') {
    return undefined;
  }

  if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
    return { confirmEmail: EMAIL_MISMATCH };
  }

  return undefined;
}
