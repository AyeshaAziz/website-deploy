import { headers } from 'next/headers';
import { supabase, type SupabaseClient } from './db';

export async function audit(params: {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
}): Promise<void> {
  const h = await headers();
  const ipAddress = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  const userAgent = h.get('user-agent');

  const { error } = await supabase.from('auditLog').insert({
    actorId: params.actorId,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    before: params.before,
    after: params.after,
    ipAddress,
    userAgent,
  });

  if (error) throw error;
}