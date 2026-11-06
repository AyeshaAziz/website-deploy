import type { ReactNode } from 'react';
import { setRegistrationStatusAction } from '@/app/admin/actions';

interface StatusToggleProps {
  reference: string;
  status: string;
}

const TOGGLE =
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-small font-medium hover:brightness-95';

export function StatusToggle({ reference, status }: StatusToggleProps): ReactNode {
  const processed = status === 'PROCESSED';
  return (
    <form action={setRegistrationStatusAction}>
      <input type="hidden" name="reference" value={reference} />
      <input type="hidden" name="status" value={processed ? 'TODO' : 'PROCESSED'} />
      <button
        type="submit"
        aria-label={processed ? 'Change status back to todo' : 'Change status to processed'}
        className={`${TOGGLE} ${processed ? 'bg-success/10 text-success' : 'bg-accent-gold/15 text-primary-neg2'}`}
      >
        {processed ? 'Processed' : 'Todo'}
      </button>
    </form>
  );
}
