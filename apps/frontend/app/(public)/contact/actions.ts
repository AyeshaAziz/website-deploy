'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(2000),
  website: z.string().max(0), // honeypot: must stay empty
});

export async function sendContact(formData: FormData): Promise<void> {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)) redirect('/contact?error=rate');

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect('/contact?error=invalid');

  // TODO: send via Amazon SES (or Resend) to the ITQA inbox. Logged for now.
  console.info('[contact] new message from', parsed.data.email);
  redirect('/contact?sent=1');
}
