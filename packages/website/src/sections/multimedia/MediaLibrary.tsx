import type { ReactNode } from 'react';
import { Container } from '@itqa/ui';
import { MediaLinks } from './MediaLinks';
import { RecentVideos } from './RecentVideos';
import type { MediaLinksRow, MediaRow } from './media.types';

export interface MediaLibraryProps {
  videos: MediaRow;
  links: MediaLinksRow;
}

export function MediaLibrary({ videos, links }: MediaLibraryProps): ReactNode {
  return (
    <section
      aria-label="Recent videos and useful links"
      className="relative overflow-hidden bg-media-library"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/images/patterns/islamic-lattice.png')] bg-cover bg-center"
      />
      <Container className="relative py-10 sm:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <RecentVideos row={videos} />
          <MediaLinks row={links} />
        </div>
      </Container>
    </section>
  );
}
