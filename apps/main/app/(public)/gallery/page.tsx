import type { Metadata } from 'next';
import {NewsletterGallery } from '@/components/multimedia/Gallery';
import { Multimedia } from '@itqa/website/sections';
import { getNewsletters } from '@/lib/newsletters';
import { getChannelVideos, getPlaylistVideos } from '@/lib/youtube';

export const metadata: Metadata = {
  title: 'Gallery - ITQA',
  description: 'ITQA newsletters and multimedia gallery.',
};

export default async function GalleryPage() {
  const [newsletters, videos, playlist] = await Promise.all([
    Promise.resolve(getNewsletters()),
    getChannelVideos(),
    getPlaylistVideos(),
  ]);
  return (
    <>
      <NewsletterGallery newsletters={newsletters} />
      <Multimedia videos={videos} playlist={playlist} />
    </>
  );
}
