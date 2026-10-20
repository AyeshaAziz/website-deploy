import { notFound } from 'next/navigation';
import { BannerSlideshow, WebsiteLanding } from '@itqa/website';
import { getCourses, getPage, getResources } from '@/lib/content';

export const revalidate = 3600; // ISR: regenerate hourly; CMS publish also revalidates on demand

const BANNER_SLIDES = [
  { src: '/images/banner_quran.png', alt: "International Ta'limul Qur'an Academy" },
  { src: '/images/banner.png', alt: "International Ta'limul Qur'an Academy" },
];

export default async function HomePage() {
  const [page, courses, resources] = await Promise.all([
    getPage('home'),
    getCourses(),
    getResources(),
  ]);
  if (!page) notFound();
  return (
    <>
      <BannerSlideshow slides={BANNER_SLIDES} />
      <WebsiteLanding page={page} courses={courses} resources={resources} />
    </>
  );
}
