import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WebsiteLanding } from '@itqa/website';
import { getCourses, getPage, getResources } from '@/lib/content';

export const revalidate = 3600;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage(params.slug);
  if (!page) return {};
  return { title: page.seoTitle ?? page.title, description: page.seoDescription ?? undefined };
}

// Serves any published CMS page (about, study-materials, ...)
export default async function CmsPage({ params }: Props) {
  const [page, courses, resources] = await Promise.all([getPage(params.slug), getCourses(), getResources()]);
  if (!page) notFound();
  return <WebsiteLanding page={page} courses={courses} resources={resources} />;
}
