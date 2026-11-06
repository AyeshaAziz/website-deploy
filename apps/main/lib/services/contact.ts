import { supabase as browserSupabase } from '@/lib/db';

export interface ContactEnquiryInput {
  name: string;
  email: string;
  department: string;
  message: string;
}

export async function saveContactEnquiry(input: ContactEnquiryInput): Promise<boolean> {
  if (!browserSupabase) return false;

  const { error } = await browserSupabase.from('contactenquiries').insert({
    name: input.name,
    email: input.email,
    department: input.department,
    message: input.message,
  });

  if (error) {
    console.error('Failed to save contact enquiry:', error);
    return false;
  }

  return true;
}