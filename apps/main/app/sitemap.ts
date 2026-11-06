import type { MetadataRoute } from 'next';
import { getPublishedPages } from '@/lib/services/sitemap';
import { getCourseSitemap } from '@/lib/courses';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL ?? 'http://localhost:3000';
  const [pages, courses] = await Promise.all([
    getPublishedPages().catch(() => []),
    getCourseSitemap().catch(() => []),
  ]);

  const pageRows = (pages as any[]).map((p: any) => ({
    url: p.urlPath === 'home' ? base : `${base}/${p.urlPath}`,
    lastModified: p.updatedAt,
  }));

  return [
    ...pageRows,
    { url: `${base}/courses` },
    { url: `${base}/contact` },
    ...(courses as any[]).map((c: any) => ({
      url: `${base}/courses/${c.urlPath}`,
      lastModified: new Date(c.updatedAt),
    })),
  ];
}
