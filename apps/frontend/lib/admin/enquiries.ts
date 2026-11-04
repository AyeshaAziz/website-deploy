import { createServerSupabaseClient } from '@/utils/supabase/server';
import type { AdminEnquiryRow, EnquiryStatus } from './interfaces/enquiries';

interface EnquiryRecord {
  id: number;
  name: string;
  email: string;
  department: string;
  message: string;
  created_at: string;
  status?: string;
}

function toRow(record: EnquiryRecord): AdminEnquiryRow {
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
  supabase: ReturnType<typeof createServerSupabaseClient>,
  columns: string,
) {
  return supabase
    .from('contactenquiries')
    .select(columns)
    .order('created_at', { ascending: false });
}

export async function getEnquiries(): Promise<AdminEnquiryRow[] | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await fetchEnquiries(supabase, ENQUIRY_COLUMNS);

  if (error || !data) {
    const retry = await fetchEnquiries(supabase, ENQUIRY_COLUMNS_WITHOUT_STATUS);
    if (retry.error || !retry.data) {
      console.error('Failed to load enquiries:', error);
      return null;
    }
    return (retry.data as unknown as EnquiryRecord[]).map(toRow);
  }

  return (data as unknown as EnquiryRecord[]).map(toRow);
}

export async function setEnquiryStatus(
  id: number,
  status: EnquiryStatus,
): Promise<boolean> {
  const supabase = createServerSupabaseClient();
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
