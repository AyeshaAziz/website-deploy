import type { ReactNode } from 'react';
import type { MediaItem } from './media.types';

export function PlaylistCard({ item }: { item: MediaItem }): ReactNode {
  return (
    <article className="overflow-hidden rounded-card border-[3px] border-primary-neg1/80 bg-white/95 shadow-playlist-card">
      <div className="relative aspect-video overflow-hidden bg-primary-neg2">
        <img src={item.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-cabin text-small font-bold leading-tight text-primary-7">{item.title}</h3>
        {item.description && (
          <p className="mt-1 line-clamp-3 text-[10px] leading-snug text-neutral-600">{item.description}</p>
        )}
        {item.href && (
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex rounded-full bg-primary-1 px-3 py-1 text-[10px] font-semibold text-white hover:bg-primary-neg1"
          >
            {item.ctaLabel ?? 'View'}
          </a>
        )}
      </div>
    </article>
  );
}
