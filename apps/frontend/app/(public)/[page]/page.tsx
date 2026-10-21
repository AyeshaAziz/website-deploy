import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WebsiteLanding } from '@itqa/website';
import { getCourses, getPage, getResources } from '@/lib/content';
import { getChannelVideos, getPlaylistVideos } from '@/lib/youtube';

export const revalidate = 3600;

type Props = { params: { page: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage(params.page);
  if (!page) return {};
  return { title: page.seoTitle ?? page.title, description: page.seoDescription ?? undefined };
}

// Serves any published CMS page (about, study-materials, ...)
export default async function CmsPage({ params }: Props) {
  const page = await getPage(params.page);
  if (!page) notFound();
  const hasMultimedia = page.sections.some((section) => section.type === 'MULTIMEDIA');
  const [courses, resources, videos, playlist] = await Promise.all([
    getCourses(),
    getResources(),
    hasMultimedia ? getChannelVideos() : Promise.resolve([]),
    hasMultimedia ? getPlaylistVideos() : Promise.resolve([]),
  ]);
  return (
    <WebsiteLanding page={page} courses={courses} resources={resources} videos={videos} playlist={playlist} />
  );
}
