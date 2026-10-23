import { FALLBACK_COURSES } from '@itqa/core';
import type { CourseDTO, PageDTO, ResourceDTO, SectionType } from '@itqa/core';

// No DATABASE_URL (or an unreachable database) = frontend-only mode with static fallbacks.
const hasDb = () => Boolean(process.env.DATABASE_URL);

async function db() {
  return (await import('@itqa/database')).prisma;
}

function fallbackPage(urlPath: string): PageDTO {
  return {
    urlPath,
    title: urlPath,
    sections:
      urlPath === 'home'
        ? [
            {
              id: 'home-featured-courses',
              type: 'FEATURED_COURSES',
              order: 0,
              visible: true,
              content: { heading: 'ITQA COURSES' },
            },
            {
              id: 'home-multimedia',
              type: 'MULTIMEDIA',
              order: 1,
              visible: true,
              content: {},
            },
          ]
        : [],
  };
}

export async function getPage(urlPath: string): Promise<PageDTO | null> {
  if (!hasDb()) return fallbackPage(urlPath);
  try {
    const prisma = await db();
    const page = await prisma.websitePage.findFirst({
      where: { urlPath, status: 'PUBLISHED' },
      include: { sections: { where: { visible: true }, orderBy: { order: 'asc' } } },
    });
    if (!page) return null;
    return {
      urlPath: page.urlPath,
      title: page.title,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      sections: page.sections.map((s) => ({
        id: s.id,
        type: s.type as SectionType,
        order: s.order,
        visible: s.visible,
        content: (s.content ?? {}) as Record<string, unknown>,
      })),
    };
  } catch {
    return fallbackPage(urlPath);
  }
}

const courseSelect = { id: true, urlPath: true, title: true, summary: true, description: true, imageUrl: true } as const;

export async function getCourses(): Promise<CourseDTO[]> {
  if (!hasDb()) return FALLBACK_COURSES;
  try {
    const prisma = await db();
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED', archivedAt: null },
      orderBy: { sortOrder: 'asc' },
      select: courseSelect,
    });
    return courses;
  } catch {
    return FALLBACK_COURSES;
  }
}

export async function getCourse(urlPath: string): Promise<CourseDTO | null> {
  if (!hasDb()) return FALLBACK_COURSES.find((c) => c.urlPath === urlPath) ?? null;
  try {
    const prisma = await db();
    return await prisma.course.findFirst({
      where: { urlPath, status: 'PUBLISHED', archivedAt: null },
      select: courseSelect,
    });
  } catch {
    return FALLBACK_COURSES.find((c) => c.urlPath === urlPath) ?? null;
  }
}

export async function getResources(): Promise<ResourceDTO[]> {
  if (!hasDb()) return [];
  try {
    const prisma = await db();
    return await prisma.resource.findMany({
      where: { status: 'PUBLISHED', archivedAt: null },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, title: true, url: true, kind: true, description: true },
    });
  } catch {
    return [];
  }
}