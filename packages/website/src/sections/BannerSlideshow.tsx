'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@itqa/shared';

export type BannerSlide = { src: string; alt: string };

export interface BannerSlideshowProps {
  slides: BannerSlide[];
  intervalMs?: number;
  className?: string;
}

function Arrow({ direction }: { direction: 'left' | 'right' }): ReactNode {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
      <path
        d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const controlClasses =
  'absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary-neg2/60 p-2 text-white transition-colors hover:bg-primary-neg2/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export function BannerSlideshow({ slides, intervalMs = 5000, className }: BannerSlideshowProps): ReactNode {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reducedMotion) return;
    const id = window.setInterval(() => setIndex((current) => (current + 1) % count), intervalMs);
    return () => window.clearInterval(id);
  }, [count, paused, reducedMotion, intervalMs]);

  if (count === 0) return null;

  const go = (next: number) => setIndex(((next % count) + count) % count);

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured banner"
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
          go(index - 1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          go(index + 1);
        }
      }}
    >
      <div className="relative h-[220px] sm:h-[320px] lg:h-[440px]">
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

      {count > 1 && (
        <>
          <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} className={cn(controlClasses, 'left-3')}>
            <Arrow direction="left" />
          </button>
          <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} className={cn(controlClasses, 'right-3')}>
            <Arrow direction="right" />
          </button>
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
