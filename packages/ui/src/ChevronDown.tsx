import type { ReactNode } from 'react';
import { cn } from '@itqa/core';

export function ChevronDown({ className }: { className?: string }): ReactNode {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={cn('h-2.5 w-2.5 shrink-0', className)}>
      <path
        d="M2 4l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}



