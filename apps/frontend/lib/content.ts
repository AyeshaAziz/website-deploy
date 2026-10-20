// import { prisma } from '@itqa/database';
// import type { CourseDTO, PageDTO, ResourceDTO, SectionType } from '@itqa/shared';

// export async function getPage(slug: string): Promise<PageDTO | null> {
//   const page = await prisma.websitePage.findFirst({
//     where: { slug, status: 'PUBLISHED' },
//     include: { sections: { where: { visible: true }, orderBy: { order: 'asc' } } },
//   });
//   if (!page) return null;
//   return {
//     slug: page.slug,
//     title: page.title,
//     seoTitle: page.seoTitle,
//     seoDescription: page.seoDescription,
//     sections: page.sections.map((s) => ({
//       id: s.id,
//       type: s.type as SectionType,
//       order: s.order,
//       visible: s.visible,
//       content: (s.content ?? {}) as Record<string, unknown>,
//     })),
//   };
// }

// const courseSelect = { id: true, slug: true, title: true, summary: true, description: true, imageUrl: true } as const;

// export async function getCourses(): Promise<CourseDTO[]> {
//   return prisma.course.findMany({
//     where: { status: 'PUBLISHED', archivedAt: null },
//     orderBy: { sortOrder: 'asc' },
//     select: courseSelect,
//   });
// }

// export async function getCourse(slug: string): Promise<CourseDTO | null> {
//   return prisma.course.findFirst({
//     where: { slug, status: 'PUBLISHED', archivedAt: null },
//     select: courseSelect,
//   });
// }

// export async function getResources(): Promise<ResourceDTO[]> {
//   return prisma.resource.findMany({
//     where: { status: 'PUBLISHED', archivedAt: null },
//     orderBy: { sortOrder: 'asc' },
//     select: { id: true, title: true, url: true, kind: true, description: true },
//   });
// }
import type { CourseDTO, PageDTO, ResourceDTO, SectionType } from '@itqa/shared';

// No DATABASE_URL = frontend-only mode: everything returns empty, Prisma is never loaded.
const hasDb = () => Boolean(process.env.DATABASE_URL);

async function db() {
  return (await import('@itqa/database')).prisma;
}

export async function getPage(slug: string): Promise<PageDTO | null> {
  if (!hasDb()) return { slug, title: slug, sections: [] };
  const prisma = await db();
  const page = await prisma.websitePage.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { sections: { where: { visible: true }, orderBy: { order: 'asc' } } },
  });
  if (!page) return null;
  return {
    slug: page.slug,
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
}

const courseSelect = { id: true, slug: true, title: true, summary: true, description: true, imageUrl: true } as const;

export async function getCourses(): Promise<CourseDTO[]> {
  if (!hasDb()) return [];
  const prisma = await db();
  return prisma.course.findMany({
    where: { status: 'PUBLISHED', archivedAt: null },
    orderBy: { sortOrder: 'asc' },
    select: courseSelect,
  });
}

export async function getCourse(slug: string): Promise<CourseDTO | null> {
  if (!hasDb()) return null;
  const prisma = await db();
  return prisma.course.findFirst({
    where: { slug, status: 'PUBLISHED', archivedAt: null },
    select: courseSelect,
  });
}

export async function getResources(): Promise<ResourceDTO[]> {
  if (!hasDb()) return [];
  const prisma = await db();
  return prisma.resource.findMany({
    where: { status: 'PUBLISHED', archivedAt: null },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, title: true, url: true, kind: true, description: true },
  });
}