import type { PageDTO, ResourceDTO, SectionType } from '@itqasys/core';
import { supabase } from './db';

// No DATABASE_URL (or an unreachable database) = frontend-only mode with static fallbacks.
const hasDb = () => Boolean((process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY));

async function db() {
  return supabase;
}

export function fallbackPage(urlPath: string): PageDTO {
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
    if (error) {
      if (error.code === 'PGRST116') return null;
      // CMS tables not deployed (schema cache miss) = frontend-only mode; serve 404, not 500.
      if (error.code === 'PGRST205') return null;
      console.error('Failed to load page from database:', error);
      throw new Error(error.message || 'Failed to load page from database');
    }
    if (!page) return null;
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
  } catch (error) {
    console.error('Failed to load page from database:', error);
    throw error instanceof Error ? error : new Error('Failed to load page from database');
  }
}

export async function getPageSafe(urlPath: string): Promise<PageDTO> {
  try {
    const page = await getPage(urlPath);
    return page ?? fallbackPage(urlPath);
  } catch (error) {
    console.error('Failed to load page from database:', error);
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
      .order('sortOrder', { ascending: true })
      .order('createdAt', { ascending: true });
    if (error) {
      // Resource table not deployed (schema cache miss) = frontend-only mode; serve empty list.
      if (error.code === 'PGRST205') return [];
      console.error('Failed to load resources from database:', error);
      throw new Error(error.message || 'Failed to load resources from database');
    }
    return (data ?? []) as ResourceDTO[];
  } catch (error) {
    console.error('Failed to load resources from database:', error);
    throw error instanceof Error ? error : new Error('Failed to load resources from database');
  }
}

export async function getResourcesSafe(): Promise<ResourceDTO[]> {
  try {
    return await getResources();
  } catch (error) {
    console.error('Failed to load resources from database:', error);
    return [];
  }
}
