import type { ReactNode } from 'react';
import { setEnquiryStatusAction } from '@/app/admin/actions';

interface EnquiryStatusToggleProps {
  id: number;
  status: string;
}

const TOGGLE =
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-small font-medium hover:brightness-95';

export function EnquiryStatusToggle({ id, status }: EnquiryStatusToggleProps): ReactNode {
  const processed = status === 'PROCESSED';
  return (
    <form action={setEnquiryStatusAction}>
      <input type="hidden" name="id" value={id} />
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
