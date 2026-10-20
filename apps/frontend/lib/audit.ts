import { headers } from 'next/headers';
import { prisma, Prisma } from '@itqa/database';

export async function audit(params: {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
}): Promise<void> {
  const h = await headers();
  const json = (v: unknown) => (v === undefined ? undefined : (v as Prisma.InputJsonValue));
  await prisma.auditLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      before: json(params.before),
      after: json(params.after),
      ipAddress: h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      userAgent: h.get('user-agent'),
    },
  });
}
