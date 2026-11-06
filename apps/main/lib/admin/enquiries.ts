import { createServerSupabaseClient } from '@/utils/supabase/server';
import type { SupabaseClient } from '@/lib/db';
import type { AdminEnquiryRow, EnquiryStatus } from '@/lib/admin/interfaces/enquiries';

interface EnquiryRecord {
  id: number;
  name: string;
  email: string;
  department: string;
  message: string;
  created_at: string;
  status?: string;
}

function toEnquiryRow(record: EnquiryRecord): AdminEnquiryRow {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    department: record.department,
    message: record.message,
    createdAt: record.created_at,
    status: record.status === 'PROCESSED' ? 'PROCESSED' : 'TODO',
  };
}

const ENQUIRY_COLUMNS = 'id, name, email, department, message, created_at, status';
const ENQUIRY_COLUMNS_WITHOUT_STATUS = 'id, name, email, department, message, created_at';

function fetchEnquiries(
  supabase: SupabaseClient,
  columns: string,
) {
  return supabase
    .from('contactenquiries')
    .select(columns)
    .order('created_at', { ascending: false });
}

export async function getEnquiries(
  client?: SupabaseClient,
): Promise<AdminEnquiryRow[] | null> {
  const supabase = client ?? createServerSupabaseClient();
  const { data, error } = await fetchEnquiries(supabase, ENQUIRY_COLUMNS);

  if (error || !data) {
    const retry = await fetchEnquiries(supabase, ENQUIRY_COLUMNS_WITHOUT_STATUS);
    if (retry.error || !retry.data) {
      console.error('Failed to load enquiries:', error);
      return null;
    }
    return (retry.data as unknown as EnquiryRecord[]).map(toEnquiryRow);
  }

  return (data as unknown as EnquiryRecord[]).map(toEnquiryRow);
}

export async function deleteEnquiry(
  id: number,
  client?: SupabaseClient,
): Promise<boolean> {
  const supabase = client ?? createServerSupabaseClient();
  const { error } = await supabase.from('contactenquiries').delete().eq('id', id);

  if (error) {
    console.error('Failed to delete enquiry:', error);
    return false;
  }

  return true;
}

export async function setEnquiryStatus(
  id: number,
  status: EnquiryStatus,
  client?: SupabaseClient,
): Promise<boolean> {
  const supabase = client ?? createServerSupabaseClient();
  const { error } = await supabase
    .from('contactenquiries')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Failed to update enquiry status:', error);
    return false;
  }

  return true;
}
