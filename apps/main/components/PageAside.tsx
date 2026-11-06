import type { ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@itqasys/core';

export interface PageAsideImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
}

interface PageAsideProps {
  image: PageAsideImage;
  heading: string;
  body: string;
  headingId: string;
  className?: string;
}

export function PageAside({
  image,
  heading,
  body,
  headingId,
  className,
}: PageAsideProps): ReactNode {
  return (
    <aside aria-labelledby={headingId} className={cn('min-w-0', className)}>
      <div className="overflow-hidden rounded-card border border-primary-5">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={image.sizes}
          preload
          loading="eager"
          fetchPriority="high"
          className="h-auto w-full"
        />
      </div>
      <h2 id={headingId} className="mt-6 font-heading text-h2 text-primary-neg2">
        {heading}
      </h2>
      <p className="mt-2 text-body text-neutral-600">{body}</p>
    </aside>
  );
}
