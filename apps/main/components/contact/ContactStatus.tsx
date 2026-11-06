import type { ReactNode } from 'react';
import type { ContactFormCopy } from '@/lib/contact/content';

interface ContactStatusProps {
  sent: boolean;
  error: boolean;
  copy: ContactFormCopy;
}

export function ContactStatus({ sent, error, copy }: ContactStatusProps): ReactNode {
  if (!sent && !error) return null;

  return (
    <>
      {sent && (
        <p role="status" className="mb-4 rounded-card bg-success/10 p-3 text-success">
          {copy.success}
        </p>
      )}
      {error && (
        <p role="alert" className="mb-4 rounded-card bg-danger/10 p-3 text-danger">
          {copy.error}
        </p>
      )}
    </>
  );
}
