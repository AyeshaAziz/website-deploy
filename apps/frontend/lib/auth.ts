import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import type { Role } from '@itqasys/core';

export interface Session {
  userId: string;
  email: string;
  role: Role;
}

export async function getSession(): Promise<Session | null> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') return null;
  return { userId: user.id, email: user.email ?? '', role: 'ADMIN' };
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

export function requireRole(session: Session, roles: Role[]): void {
  if (!roles.includes(session.role)) throw new Error('Forbidden');
}

export async function destroySession(): Promise<void> {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
}

// Keep a no-op createSession for backwards compatibility with callers that
// still reference it; Supabase manages the session cookies itself.
export async function createSession(_session: Session): Promise<void> {
  void _session;
  // Intentionally empty: Supabase Auth sets the session cookies.
}
