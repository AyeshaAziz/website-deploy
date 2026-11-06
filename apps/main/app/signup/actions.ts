'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export async function signUp(formData: FormData): Promise<void> {
  const parsed = z
    .object({
      email: z.string().email(),
      password: z.string().min(8),
      fullName: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));

  if (!parsed.success) redirect('/signup?error=1');

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName ?? '' },
    },
  });
console.log('signUp error', error);
  if (error) redirect(`/signup?error=1&message=${encodeURIComponent(error.message)}`);

  redirect('/signup?success=1');
}
