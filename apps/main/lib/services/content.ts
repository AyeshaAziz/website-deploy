import { supabase as browserSupabase } from '@/lib/db';
import type { PageDTO, ResourceDTO, SectionType } from '@itqasys/core';

export function fallbackPage(urlPath: string): PageDTO {
  return {
    urlPath,
    title: urlPath,
    sections:
      urlPath === 'home'
        ? [
            {
              id: 'home-featured-courses',
              type: 'FEATURED_COURSES' as SectionType,
              order: 0,
              visible: true,
              content: { heading: 'ITQA COURSES' },
            },
            {
              id: 'home-multimedia',
              type: 'MULTIMEDIA' as SectionType,
              order: 1,
              visible: true,
              content: {},
            },
          ]
        : [],
  };
}

export async function getPage(urlPath: string): Promise<PageDTO | null> {
  const hasDb = Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY),
  );
  if (!hasDb) return fallbackPage(urlPath);

  try {
    const supa = browserSupabase;
    if (!supa) return fallbackPage(urlPath);
    const { data: page, error } = await supa
      .from('websitePage')
      .select('*, sections(*)')
      .eq('urlPath', urlPath)
      .eq('status', 'PUBLISHED')
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
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

export async function getResources(): Promise<ResourceDTO[]> {
  const hasDb = Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY),
  );
  if (!hasDb) return [];
  try {
    const supa = browserSupabase;
    if (!supa) return [];
    const { data, error } = await supa
      .from('resource')
      .select('id, title, url, kind, description')
      .eq('status', 'PUBLISHED')
      .order('sortOrder', { ascending: true })
      .order('createdAt', { ascending: true });
    if (error) {
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