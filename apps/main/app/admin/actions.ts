'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { destroySession, requireAuth, requireRole } from '@/lib/auth';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { getProfileRole } from '@/lib/services/profiles';
import { setRegistrationStatus, deleteRegistration } from '@/lib/services/admin';
import { setEnquiryStatus, deleteEnquiry } from '@/lib/services/admin';

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

  const role = await getProfileRole(user.id, authClient);

  const safeRedirect =
    redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')
      ? redirectTo
      : role === 'admin'
        ? '/admin'
        : '/';

  redirect(safeRedirect);
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect('/login');
}

export async function setRegistrationStatusAction(formData: FormData): Promise<void> {
  const session = await requireAuth();
  requireRole(session, ['ADMIN', 'CONTENT_EDITOR']);

  const parsed = z
    .object({
      reference: z.string().min(1).max(64),
      status: z.enum(['TODO', 'PROCESSED']),
    })
    .safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return;
  }

  await setRegistrationStatus(parsed.data.reference, parsed.data.status);
  revalidatePath('/admin');
}

export async function setEnquiryStatusAction(formData: FormData): Promise<void> {
  const session = await requireAuth();
  requireRole(session, ['ADMIN', 'CONTENT_EDITOR']);

  const parsed = z
    .object({
      id: z.coerce.number().int().positive(),
      status: z.enum(['TODO', 'PROCESSED']),
    })
    .safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return;
  }

  await setEnquiryStatus(parsed.data.id, parsed.data.status);
  revalidatePath('/admin');
}

export async function deleteRegistrationAction(formData: FormData): Promise<void> {
  const session = await requireAuth();
  requireRole(session, ['ADMIN', 'CONTENT_EDITOR']);

  const parsed = z
    .object({ reference: z.string().min(1).max(64) })
    .safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return;
  }

  await deleteRegistration(parsed.data.reference);
  revalidatePath('/admin');
}

export async function deleteEnquiryAction(formData: FormData): Promise<void> {
  const session = await requireAuth();
  requireRole(session, ['ADMIN', 'CONTENT_EDITOR']);

  const parsed = z
    .object({ id: z.coerce.number().int().positive() })
    .safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return;
  }

  await deleteEnquiry(parsed.data.id);
  revalidatePath('/admin');
}
