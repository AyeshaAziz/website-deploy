'use client';

import { useCallback, useEffect, useState } from 'react';

export interface CarouselIndex {
  index: number;
  paused: boolean;
  reducedMotion: boolean;
  setPaused: (paused: boolean) => void;
  go: (next: number) => void;
  next: () => void;
  previous: () => void;
}

export function useCarouselIndex(count: number, intervalMs: number): CarouselIndex {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (): void => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reducedMotion) return;
    const id = window.setInterval(() => setIndex((current) => (current + 1) % count), intervalMs);
    return () => window.clearInterval(id);
  }, [count, paused, reducedMotion, intervalMs]);

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const previous = useCallback(() => go(index - 1), [go, index]);

  return { index, paused, reducedMotion, setPaused, go, next, previous };
}
