'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Container, SectionHeading } from '@itqa/ui';
import { Carousel } from '@itqa/website';
import { Flipbook } from '@/components/flipbook/Flipbook';
import type { Newsletter } from '@/lib/newsletters';

interface MultimediaGalleryProps {
  newsletters: Newsletter[];
}

export function NewsletterGallery({ newsletters }: MultimediaGalleryProps): ReactNode {
  return (
    <Container className="py-section-sm">
      <SectionHeading as="h1" title="Newsletters" className="mb-6" />
      {newsletters.length === 0 ? (
        <p className="text-neutral-600">No newsletters available.</p>
      ) : (
        <Carousel
          variant="scroll"
          items={newsletters}
          getKey={(item) => item.href}
          renderItem={(item) => (
            <Flipbook
              src={item.href}
              title={item.name}
              thumbnail={item.thumbnail}
              priority={newsletters.indexOf(item) < 3}
            />
          )}
          itemClassName="w-56 shrink-0"
          prevLabel="Previous newsletters"
          nextLabel="Next newsletters"
        />
      )}
    </Container>
  );
}
