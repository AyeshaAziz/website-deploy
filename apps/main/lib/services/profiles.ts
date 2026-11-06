import { createServerSupabaseClient } from '@/utils/supabase/server';
import type { SupabaseClient } from '@/lib/db';

export async function getProfileRole(
  userId: string,
  client?: SupabaseClient,
): Promise<string | null> {
  const supabase = client ?? createServerSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  return (profile?.role as string | undefined) ?? null;
}

export async function upsertProfileRole(
  client: SupabaseClient,
  userId: string,
  email: string,
): Promise<void> {
  const { error } = await client.from('profiles').upsert({
    id: userId,
    email,
    role: 'admin',
  });
  if (error) throw error;
}