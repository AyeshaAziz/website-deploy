'use client';

import type { ReactNode } from 'react';
import { cn } from '@itqasys/core';
import { CarouselArrow } from './CarouselArrow';
import type { PlaylistCarouselProps } from './carousel.types';
import { HIDE_SCROLLBAR } from './carousel.utils';
import { useHorizontalScroll } from './useHorizontalScroll';

export const PLAYLIST_POSITIONS = [
  'z-10 translate-y-5 -mr-8',
  'z-20 translate-y-2 -mr-8',
  'z-30 -translate-y-2 scale-105',
  'z-20 translate-y-2 -ml-8',
  'z-10 translate-y-5 -ml-8',
] as const;

export function PlaylistTrack<T>({
  items,
  getKey,
  renderItem,
  itemClassName,
  itemPositions = PLAYLIST_POSITIONS,
  prevLabel = 'Scroll back',
  nextLabel = 'Scroll forward',
  arrowTone = 'default',
  className,
}: PlaylistCarouselProps<T>): ReactNode {
  const { ref, scroll } = useHorizontalScroll();

  return (
    <div className={cn('relative', className)}>
      <CarouselArrow
        direction={-1}
        label={prevLabel}
        onClick={() => scroll(-1)}
        tone={arrowTone}
        className="-left-3 max-sm:hidden"
      />
      <ul
        ref={ref}
        className={cn('flex snap-x gap-0 overflow-x-auto px-2 pt-4 pb-8 md:px-4 md:pb-6', HIDE_SCROLLBAR)}
      >
        {items.map((item, index) => (
          <li
            key={getKey(item, index)}
            className={cn(
              'relative w-[180px] shrink-0 snap-center transition-transform duration-200 hover:z-40 hover:scale-105 sm:w-[200px] md:w-[calc(20%+1.6rem)]',
              itemPositions[index % itemPositions.length],
              itemClassName,
            )}
          >
            {renderItem(item)}
          </li>
        ))}
      </ul>
      <CarouselArrow
        direction={1}
        label={nextLabel}
        onClick={() => scroll(1)}
        tone={arrowTone}
        className="-right-3 max-sm:hidden"
      />
    </div>
  );
}
