import type { ReactNode } from 'react';
import type { MediaVideoDTO } from '@itqa/core';
import { Container } from '@itqa/ui';
import mediaData from './media.json';
import { MediaLibrary } from './MediaLibrary';
import { PlaylistCarousel } from './PlaylistCarousel';
import type { MediaRow, MultimediaContent } from './media.types';

const CONTENT = mediaData as MultimediaContent;

export interface MultimediaProps {
  videos?: MediaVideoDTO[];
  playlist?: MediaVideoDTO[];
}

function toMediaRow(title: string, videos: MediaVideoDTO[]): MediaRow {
  return {
    title,
    items: videos.map((video) => ({
      id: video.id,
      title: video.title,
      imageUrl: video.imageUrl,
      href: video.url,
    })),
  };
}

export function Multimedia({ videos = [], playlist = [] }: MultimediaProps): ReactNode {
  const videoRow = videos.length > 0 ? toMediaRow('Recently Added Videos', videos) : CONTENT.videos;
  const playlistRow = playlist.length > 0 ? toMediaRow(CONTENT.playlist.title, playlist) : CONTENT.playlist;

  return (
    <section className="bg-primary-8">
      <Container>
        <div className="flex w-full flex-col gap-12">
          <PlaylistCarousel row={playlistRow} />
        </div>
      </Container>
      <MediaLibrary videos={videoRow} links={CONTENT.links} />
    </section>
  );
}
