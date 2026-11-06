import type { ReactNode } from 'react';
import { cn } from '@itqasys/core';
import { IndicatorBadge } from './IndicatorBadge';

interface NotificationBellProps {
  count: number;
  active: boolean;
  onPress: () => void;
}

export function NotificationBell({ count, active, onPress }: NotificationBellProps): ReactNode {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`Registrations, ${count} unprocessed`}
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
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <IndicatorBadge count={count} />
    </button>
  );
}
