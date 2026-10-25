'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { supabase } from '@/lib/db';
import type { Role } from '@itqasys/core';
import { audit } from '@/lib/audit';
import { createSession, destroySession, requireAuth, requireRole } from '@/lib/auth';

const EDITOR_ROLES: Role[] = ['ADMIN', 'CONTENT_EDITOR'];

export async function login(formData: FormData): Promise<void> {
  const parsed = z
    .object({ email: z.string().email(), password: z.string().min(1) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect('/admin/login?error=1');

  const { data: user, error } = await supabase.from('users').select('*').eq('email', parsed.data.email).single();
  if (error || !user) redirect('/admin/login?error=1');

  const ok = !user.archivedAt && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!user || !ok) redirect('/admin/login?error=1');

  await createSession({ userId: user.id, email: user.email, role: user.role });
  redirect('/admin/content-management');
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect('/admin/login');
}

function pagePath(urlPath: string): string {
  return urlPath === 'home' ? '/' : `/${urlPath}`;
}

export async function updateSection(formData: FormData): Promise<void> {
  const session = await requireAuth();
  requireRole(session, EDITOR_ROLES);

  const id = z.string().min(1).parse(formData.get('id'));
  const content = z.record(z.unknown()).parse(JSON.parse(String(formData.get('content'))));

  const before = await supabase.from('sections').select('*, page:urlPath(title,status)').eq('id', id).single();
  const after = await supabase.from('sections').update({ id, data: content }).select('*, page:urlPath(title,status)').single();

  await audit({ actorId: session.userId, action: 'SECTION_UPDATED', entityType: 'Section', entityId: id, before: before.data?.content, after: after.data?.content });
  revalidatePath(pagePath(before.data?.page?.urlPath));
  revalidatePath(`/admin/content-management/${before.data?.page?.urlPath}`);
}

export async function setPageStatus(formData: FormData): Promise<void> {
  const session = await requireAuth();
  requireRole(session, EDITOR_ROLES);

  const urlPath = z.string().min(1).parse(formData.get('urlPath'));
  const status = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).parse(formData.get('status'));

  const before = await supabase.from('websitePage').select('*, publishedById').eq('urlPath', urlPath).single();
  const after = await supabase.from('websitePage').update({ urlPath, data: { status, publishedAt: status === 'PUBLISHED' ? new Date() : before.data?.publishedAt, publishedById: status === 'PUBLISHED' ? session.userId : before.data?.publishedById } }).select().single();

  await audit({ actorId: session.userId, action: `PAGE_${status}`, entityType: 'WebsitePage', entityId: after.id, before: { status: before.data?.status }, after: { status: after.status } });
  revalidatePath(pagePath(urlPath));
  revalidatePath(`/admin/content-management/${urlPath}`);
}