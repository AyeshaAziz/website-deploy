'use client';

import type { ReactNode } from 'react';
import { cn } from '@itqasys/core';
import type { CarouselArrowTone } from './carousel.types';

export interface CarouselArrowProps {
  direction: -1 | 1;
  label: string;
  onClick: () => void;
  tone?: CarouselArrowTone;
  className?: string;
}

const TONE_CLASSES: Record<CarouselArrowTone, string> = {
  default: 'border-primary-5 bg-primary-6/95 text-primary-7 hover:bg-white',
  warm: 'border-white/70 bg-warm-surface/95 text-warm-ink hover:bg-white',
  overlay: 'border-transparent bg-primary-neg2/60 text-white hover:bg-primary-neg2/85',
};

export function CarouselArrow({
  direction,
  label,
  onClick,
  tone = 'default',
  className,
}: CarouselArrowProps): ReactNode {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition-colors',
        TONE_CLASSES[tone],
        className,
      )}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none">
        <path
          d={direction === -1 ? 'm15 5-7 7 7 7' : 'm9 5 7 7-7 7'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
