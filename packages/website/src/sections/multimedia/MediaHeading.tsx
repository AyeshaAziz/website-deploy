import type { ReactNode } from 'react';
import { cn } from '@itqasys/core';

export interface MediaHeadingProps {
  id: string;
  children: string;
  variant?: 'default' | 'warm';
}

export function MediaHeading({
  id,
  children,
  variant = 'default',
}: MediaHeadingProps): ReactNode {
  return (
    <h2
      id={id}
      className={cn(
        'w-fit rounded-full border text-center font-cabin text-h3 font-bold uppercase tracking-wide',
        'mx-auto',
        variant === 'warm'
          ? 'border-white/70 bg-warm-surface/95 px-8 py-2 text-warm-ink shadow-warm-card ring-2 ring-warm-border/70'
          : 'border-primary-5 bg-primary-6/90 px-6 py-1.5 text-primary-7 shadow-sm',
      )}
    >
      {children}
    </h2>
  );
}
