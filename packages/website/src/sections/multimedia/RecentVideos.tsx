'use client';

import type { ReactNode } from 'react';
import { Carousel } from '../shared/carousel';
import { MediaHeading } from './MediaHeading';
import type { MediaItem, MediaRow } from './media.types';

function PlayIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-0.5 h-5 w-5 text-primary-7" fill="currentColor">
      <path d="M8 5v14l11-7Z" />
    </svg>
  );
}

const CARD_CLASS = 'group relative block overflow-hidden border-[4px] border-warm-border bg-primary-neg2 shadow-lg';

function VideoCard({ item }: { item: MediaItem }): ReactNode {
  const body = (
    <>
      <img src={item.imageUrl} alt="" loading="lazy" className="aspect-video h-full w-full object-cover opacity-90" />
      <div className="absolute inset-0 bg-primary-neg2/20" aria-hidden="true" />
      <h3 className="sr-only">{item.title}</h3>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-md">
          <PlayIcon />
        </span>
      </span>
      {item.duration && (
        <span className="absolute bottom-2 right-2 rounded bg-primary-neg2/85 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {item.duration}
        </span>
      )}
    </>
  );

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={CARD_CLASS}>
        {body}
      </a>
    );
  }
  return <article className={CARD_CLASS}>{body}</article>;
}

export function RecentVideos({ row }: { row: MediaRow }): ReactNode {
  return (
    <section aria-labelledby="recent-videos">
      <MediaHeading id="recent-videos" variant="warm">
        {row.title}
      </MediaHeading>
      <Carousel<MediaItem>
        variant="scroll"
        items={row.items}
        getKey={(item) => item.id}
        itemClassName="w-[260px] sm:w-[calc((100%-2rem)/3)]"
        prevLabel="Previous videos"
        nextLabel="Next videos"
        arrowTone="warm"
        className="mt-6"
        renderItem={(item) => <VideoCard item={item} />}
      />
    </section>
  );
}
