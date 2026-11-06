import type { ReactNode } from 'react';
import { cn } from '@itqasys/core';

interface IndicatorBadgeProps {
  count: number;
}

export function IndicatorBadge({ count }: IndicatorBadgeProps): ReactNode {
  return (
    <span
      className={cn(
        'absolute -right-2 -top-1.5 rounded-full px-1.5 text-center text-small font-bold',
        count > 0 ? 'bg-accent-gold text-primary-neg2' : 'bg-primary-5 text-primary-neg1',
      )}
    >
      {count}
    </span>
  );
}
