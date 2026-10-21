'use client';

import type { ReactNode } from 'react';
import { Carousel } from '../shared/carousel';
import { MediaHeading } from './MediaHeading';
import type { MediaItem, MediaRow } from './media.types';
import { PlaylistCard } from './PlaylistCard';

export function PlaylistCarousel({ row }: { row: MediaRow }): ReactNode {
  return (
    <section aria-labelledby="itqa-playlist" className="py-6 sm:py-8">
      <MediaHeading id="itqa-playlist">{row.title}</MediaHeading>
      <Carousel<MediaItem>
        variant="playlist"
        items={row.items}
        getKey={(item) => item.id}
        prevLabel="Previous playlist items"
        nextLabel="Next playlist items"
        className="mt-6"
        renderItem={(item) => <PlaylistCard item={item} />}
      />
    </section>
  );
}
