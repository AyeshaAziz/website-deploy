import { notFound } from 'next/navigation';
import { Carousel, WebsiteLanding } from '@itqa/website';
import { getCoursesSafe } from '@/lib/courses';
import { getPage, getResources } from '@/lib/content';
import { getChannelVideos, getPlaylistVideos } from '@/lib/youtube';

export const revalidate = 3600; // ISR: regenerate hourly; CMS publish also revalidates on demand

const BANNER_SLIDES = [
    { src: '/images/banner-ws.png', alt: "International Ta'limul Qur'an Academy" },
  { src: '/images/banner_quran.png', alt: "International Ta'limul Qur'an Academy" },
  { src: '/images/banner.png', alt: "International Ta'limul Qur'an Academy" },
];

export default async function HomePage() {
  const [page, courses, resources, videos, playlist] = await Promise.all([
    getPage('home'),
    getCoursesSafe(),
    getResources(),
    getChannelVideos(),
    getPlaylistVideos(),
  ]);
  if (!page) notFound();
  return (
    <>
      <Carousel variant="fade" slides={BANNER_SLIDES} ariaLabel="Featured banner" />
      <WebsiteLanding page={page} courses={courses} resources={resources} videos={videos} playlist={playlist} />
    </>
  );
}
