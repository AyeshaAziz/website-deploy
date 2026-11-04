import type { ReactNode } from 'react';
import { cn } from '@itqasys/core';
import { IndicatorBadge } from './IndicatorBadge';

interface EnquiriesIndicatorProps {
  count: number;
  active: boolean;
  onPress: () => void;
}

export function EnquiriesIndicator({ count, active, onPress }: EnquiriesIndicatorProps): ReactNode {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`Enquiries, ${count} unprocessed`}
      onClick={onPress}
      className={cn(
        'relative inline-flex items-center justify-center rounded-card p-1 text-primary-neg1 hover:bg-primary-6',
        active && 'bg-primary-2 text-white hover:bg-primary-1',
      )}
    >
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
      <IndicatorBadge count={count} />
    </button>
  );
}
