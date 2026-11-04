'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { saveContactEnquiry } from '@/lib/contact/store';
import { CONTACT_DEPARTMENTS } from '@/lib/contact/departments';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  department: z
    .string()
    .refine((id) => Object.hasOwn(CONTACT_DEPARTMENTS, id), { message: 'Unknown department' }),
  message: z.string().trim().min(1).max(2000),
  website: z.string().max(0), // honeypot: must stay empty
});

export async function sendContact(formData: FormData): Promise<void> {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)) redirect('/contact?error=rate');

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect('/contact?error=invalid');

  const recipient = CONTACT_DEPARTMENTS[parsed.data.department].email;

  const saved = await saveContactEnquiry({
    name: parsed.data.name,
    email: parsed.data.email,
    department: parsed.data.department,
    message: parsed.data.message,
  });
  if (!saved) redirect('/contact?error=server');

  console.info('[contact] enquiry saved', {
    sender: parsed.data.email,
    department: parsed.data.department,
    recipient,
  });
  redirect('/contact?sent=1');
}
