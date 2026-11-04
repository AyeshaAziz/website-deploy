import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WebsiteLanding } from '@itqa/website';
import { getCoursesSafe } from '@/lib/courses';
import { getPage, getResourcesSafe } from '@/lib/content';
import { getChannelVideos, getPlaylistVideos } from '@/lib/youtube';

export const revalidate = 3600;

type Props = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: pageParam } = await params;
  const page = await getPage(pageParam);
  if (!page) return {};
  return { title: page.seoTitle ?? page.title, description: page.seoDescription ?? undefined };
}

export default async function ContentPage({ params }: Props) {
  const { page: pageParam } = await params;
  const page = await getPage(pageParam);
  if (!page) notFound();
  const hasMultimedia = page.sections.some((section) => section.type === 'MULTIMEDIA');
  const [courses, resources, videos, playlist] = await Promise.all([
    getCoursesSafe(),
    getResourcesSafe(),
    hasMultimedia ? getChannelVideos() : Promise.resolve([]),
    hasMultimedia ? getPlaylistVideos() : Promise.resolve([]),
  ]);
  return (
    <WebsiteLanding page={page} courses={courses} resources={resources} videos={videos} playlist={playlist} />
  );
}
