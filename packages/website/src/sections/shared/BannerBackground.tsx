import type { ReactNode } from 'react';
import { cn } from '@itqasys/core';

export interface BannerBackgroundProps {
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  className?: string;
}

export function BannerBackground({
  children,
  imageSrc = '/images/background/islamic-lattice.webp',
  imageAlt = '',
  imageClassName,
  className,
}: BannerBackgroundProps): ReactNode {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-accent-gray',
        className,
      )}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        aria-hidden={imageAlt === '' ? true : undefined}
        loading="eager"
        fetchPriority="high"
        className={cn(
          'absolute inset-0 -z-10 h-full w-full object-cover',
          imageClassName ?? 'opacity-30',
        )}
      />
      <div className="absolute inset-0 -z-10" aria-hidden="true" />
      {children}
    </section>
  );
}
