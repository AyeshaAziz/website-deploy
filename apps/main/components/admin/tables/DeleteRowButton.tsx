'use client';

import { useState, type ReactNode } from 'react';

interface DeleteRowButtonProps {
  action: (formData: FormData) => Promise<void>;
  fieldName: string;
  value: string;
  itemLabel: string;
}

const BUTTON =
  'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-small font-medium transition-colors';

export function DeleteRowButton({
  action,
  fieldName,
  value,
  itemLabel,
}: DeleteRowButtonProps): ReactNode {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${itemLabel}`}
        className={`${BUTTON} bg-danger/10 text-danger hover:bg-danger/20`}
      >
        Delete
      </button>
    );
  }

  return (
    <form action={action} className="flex items-center gap-1.5">
      <input type="hidden" name={fieldName} value={value} />
      <button
        type="submit"
        aria-label={`Confirm delete ${itemLabel}`}
        className={`${BUTTON} bg-danger text-white hover:brightness-95`}
      >
        Confirm
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        aria-label={`Cancel delete ${itemLabel}`}
        className={`${BUTTON} text-neutral-700 hover:bg-primary-6`}
      >
        Cancel
      </button>
    </form>
  );
}
