import type { MetadataRoute } from 'next';
import { prisma } from '@itqa/database';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL ?? 'http://localhost:3000';
  const [pages, courses] = await Promise.all([
    prisma.websitePage.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.course.findMany({ where: { status: 'PUBLISHED', archivedAt: null }, select: { slug: true, updatedAt: true } }),
  ]);
  return [
    ...pages.map((p) => ({ url: p.slug === 'home' ? base : `${base}/${p.slug}`, lastModified: p.updatedAt })),
    { url: `${base}/courses` },
    ...courses.map((c) => ({ url: `${base}/courses/${c.slug}`, lastModified: c.updatedAt })),
  ];
}
