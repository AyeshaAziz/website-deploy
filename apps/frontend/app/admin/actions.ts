'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma, Prisma } from '@itqa/database';
import type { Role } from '@itqa/shared';
import { audit } from '@/lib/audit';
import { createSession, destroySession, requireAuth, requireRole } from '@/lib/auth';

const EDITOR_ROLES: Role[] = ['ADMIN', 'CONTENT_EDITOR'];

export async function login(formData: FormData): Promise<void> {
  const parsed = z
    .object({ email: z.string().email(), password: z.string().min(1) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect('/admin/login?error=1');

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const ok = user && !user.archivedAt && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!user || !ok) redirect('/admin/login?error=1');

  await createSession({ userId: user.id, email: user.email, role: user.role });
  redirect('/admin/content-management');
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect('/admin/login');
}

function pagePath(slug: string): string {
  return slug === 'home' ? '/' : `/${slug}`;
}

export async function updateSection(formData: FormData): Promise<void> {
  const session = await requireAuth();
  requireRole(session, EDITOR_ROLES);

  const id = z.string().min(1).parse(formData.get('id'));
  const content = z.record(z.unknown()).parse(JSON.parse(String(formData.get('content'))));

  const before = await prisma.section.findUniqueOrThrow({ where: { id }, include: { page: true } });
  const after = await prisma.section.update({ where: { id }, data: { content: content as Prisma.InputJsonObject } });

  await audit({ actorId: session.userId, action: 'SECTION_UPDATED', entityType: 'Section', entityId: id, before: before.content, after: after.content });
  revalidatePath(pagePath(before.page.slug));
  revalidatePath(`/admin/content-management/${before.page.slug}`);
}

export async function setPageStatus(formData: FormData): Promise<void> {
  const session = await requireAuth();
  requireRole(session, EDITOR_ROLES);

  const slug = z.string().min(1).parse(formData.get('slug'));
  const status = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).parse(formData.get('status'));

  const before = await prisma.websitePage.findUniqueOrThrow({ where: { slug } });
  const after = await prisma.websitePage.update({
    where: { slug },
    data: {
      status,
      publishedAt: status === 'PUBLISHED' ? new Date() : before.publishedAt,
      publishedById: status === 'PUBLISHED' ? session.userId : before.publishedById,
    },
  });

  await audit({ actorId: session.userId, action: `PAGE_${status}`, entityType: 'WebsitePage', entityId: after.id, before: { status: before.status }, after: { status: after.status } });
  revalidatePath(pagePath(slug));
  revalidatePath(`/admin/content-management/${slug}`);
}
