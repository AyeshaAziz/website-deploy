'use client';

import type { ReactNode } from 'react';
import { cn } from '@itqasys/core';
import { CarouselArrow } from './CarouselArrow';
import type { FadeCarouselProps } from './carousel.types';
import { useCarouselIndex } from './useCarouselIndex';

const DEFAULT_HEIGHT = 'h-[220px] sm:h-[320px] lg:h-[440px]';

export function FadeCarousel({
  slides,
  intervalMs = 5000,
  ariaLabel = 'Featured banner',
  heightClassName = DEFAULT_HEIGHT,
  className,
}: FadeCarouselProps): ReactNode {
  const { index, paused, reducedMotion, setPaused, go, next, previous } = useCarouselIndex(
    slides.length,
    intervalMs,
  );

  if (slides.length === 0) return null;

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      aria-live={paused || reducedMotion ? 'polite' : 'off'}
      tabIndex={0}
      className={cn('relative w-full overflow-hidden bg-primary-7', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          previous();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          next();
        }
      }}
    >
      <div className={cn('relative', heightClassName)}>
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            aria-hidden={i !== index}
            draggable={false}
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              !reducedMotion && 'transition-opacity duration-500',
              i === index ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <CarouselArrow direction={-1} label="Previous slide" onClick={previous} tone="overlay" className="left-3" />
          <CarouselArrow direction={1} label="Next slide" onClick={next} tone="overlay" className="right-3" />
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={cn(
                  'h-2.5 w-2.5 rounded-full transition-colors',
                  i === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80',
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
