'use client';

import { useRef } from 'react';
import type { RefObject } from 'react';

export interface HorizontalScroll {
  ref: RefObject<HTMLUListElement | null>;
  scroll: (direction: -1 | 1) => void;
}

export function useHorizontalScroll(): HorizontalScroll {
  const ref = useRef<HTMLUListElement>(null);

  const scroll = (direction: -1 | 1): void => {
    const element = ref.current;
    if (!element) return;
    element.scrollBy({
      left: direction * Math.max(element.clientWidth * 0.8, 240),
      behavior: 'smooth',
    });
  };

  return { ref, scroll };
}
