import type { PageDTO, ResourceDTO, SectionType } from '@itqasys/core';
import { supabase } from './db';

// No DATABASE_URL (or an unreachable database) = frontend-only mode with static fallbacks.
const hasDb = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

async function db() {
  return supabase;
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
    const supa = await db();
    const { data: page, error } = await supa
      .from('websitePage')
      .select('*, sections(*)')
      .eq('urlPath', urlPath)
      .eq('status', 'PUBLISHED')
      .single();
    if (error || !page) return null;
    return {
      urlPath: page.urlPath,
      title: page.title,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      sections: page.sections.map((s: any) => ({
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

export async function getResources(): Promise<ResourceDTO[]> {
  if (!hasDb()) return [];
  try {
    const supa = await db();
    const { data, error } = await supa
      .from('resource')
      .select('id, title, url, kind, description')
      .eq('status', 'PUBLISHED')
      .order('sortOrder', 'asc')
      .order('createdAt', 'asc');
    if (error) return [];
    return data as ResourceDTO[];
  } catch {
    return [];
  }
}