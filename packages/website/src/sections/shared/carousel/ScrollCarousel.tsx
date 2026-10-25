'use client';

import type { ReactNode } from 'react';
import { cn } from '@itqasys/core';
import { CarouselArrow } from './CarouselArrow';
import type { ScrollCarouselProps } from './carousel.types';
import { HIDE_SCROLLBAR } from './carousel.utils';
import { useHorizontalScroll } from './useHorizontalScroll';

export function ScrollCarousel<T>({
  items,
  getKey,
  renderItem,
  itemClassName,
  prevLabel = 'Scroll back',
  nextLabel = 'Scroll forward',
  arrowTone = 'default',
  className,
}: ScrollCarouselProps<T>): ReactNode {
  const { ref, scroll } = useHorizontalScroll();

  return (
    <div className={cn('relative', className)}>
      <CarouselArrow
        direction={-1}
        label={prevLabel}
        onClick={() => scroll(-1)}
        tone={arrowTone}
        className="-left-2 max-sm:hidden"
      />
      <ul ref={ref} className={cn('flex snap-x gap-4 overflow-x-auto px-1 pb-2', HIDE_SCROLLBAR)}>
        {items.map((item, index) => (
          <li key={getKey(item, index)} className={cn('shrink-0 snap-start', itemClassName)}>
            {renderItem(item)}
          </li>
        ))}
      </ul>
      <CarouselArrow
        direction={1}
        label={nextLabel}
        onClick={() => scroll(1)}
        tone={arrowTone}
        className="-right-2 max-sm:hidden"
      />
    </div>
  );
}
