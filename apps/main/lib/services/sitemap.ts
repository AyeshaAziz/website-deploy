import { supabase as browserSupabase } from '@/lib/db';

export async function getPublishedPages(): Promise<
  { urlPath: string; updatedAt: string }[]
> {
  if (!browserSupabase) return [];
  const { data, error } = await browserSupabase
    .from('websitePage')
    .select('urlPath,updatedAt')
    .eq('status', 'PUBLISHED');
  if (error) {
    console.error('Failed to load published pages:', error);
    return [];
  }
  return (data ?? []) as { urlPath: string; updatedAt: string }[];
}