'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { destroySession } from '@/lib/auth';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export async function login(formData: FormData): Promise<void> {
  const parsed = z
    .object({ email: z.string().email(), password: z.string().min(1) })
    .safeParse(Object.fromEntries(formData));
  const redirectTo = String(formData.get('redirect') ?? '').trim();

  if (!parsed.success) {
    redirect(`/login?error=1${redirectTo ? `&redirect=${encodeURIComponent(redirectTo)}` : ''}`);
  }

  const authClient = createServerSupabaseClient();
  const { error: signInError } = await authClient.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (signInError) {
    redirect(`/login?error=1${redirectTo ? `&redirect=${encodeURIComponent(redirectTo)}` : ''}`);
  }

  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) {
    redirect(`/login?error=1${redirectTo ? `&redirect=${encodeURIComponent(redirectTo)}` : ''}`);
  }

  const { data: profile } = await authClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const safeRedirect =
    redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')
      ? redirectTo
      : profile?.role === 'admin'
        ? '/admin'
        : '/';

  redirect(safeRedirect);
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect('/login');
}
