// ---------------------------------------------------------------------------
// Admin registrations
// ---------------------------------------------------------------------------

import { createServerSupabaseClient } from '@/utils/supabase/server';
import type { SupabaseClient } from '@/lib/db';
import type { AdminRegistrationRow, RegistrationStatus } from '@/lib/admin/interfaces/registrations';

interface RegistrationRecord {
  reference: string;
  first_name: string;
  last_name: string;
  track: string;
  course: string;
  course_language: string;
  second_language?: string | null;
  aims_no?: string | null;
  tanzeem: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  teaching_experience?: string | null;
  teaching_role?: string | null;
  commit_days?: unknown;
  available_times?: unknown;
  submitted_at: string;
  created_at?: string | null;
  status?: string;
}

function optionalText(value: string | null | undefined): string | undefined {
  return value ?? undefined;
}

function joinedList(value: unknown): string | undefined {
  if (Array.isArray(value)) return value.map(String).join(', ');
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function toRegistrationRow(record: RegistrationRecord): AdminRegistrationRow {
  return {
    reference: record.reference,
    firstName: record.first_name,
    lastName: record.last_name,
    track: record.track,
    course: record.course,
    courseLanguage: record.course_language,
    secondLanguage: optionalText(record.second_language),
    aimsNo: optionalText(record.aims_no),
    tanzeem: record.tanzeem,
    country: record.country,
    city: record.city,
    phone: record.phone,
    email: record.email,
    teachingExperience: optionalText(record.teaching_experience),
    teachingRole: optionalText(record.teaching_role),
    commitDays: joinedList(record.commit_days),
    availableTimes: joinedList(record.available_times),
    submittedAt: record.submitted_at,
    createdAt: record.created_at ?? record.submitted_at,
    status: record.status === 'PROCESSED' ? 'PROCESSED' : 'TODO',
  };
}

const BASE_COLUMNS = [
  'reference',
  'first_name',
  'last_name',
  'track',
  'tanzeem',
  'country',
  'city',
  'phone',
  'email',
  'course',
  'course_language',
  'second_language',
  'aims_no',
  'teaching_experience',
  'teaching_role',
  'commit_days',
  'available_times',
  'submitted_at',
  'created_at',
].join(', ');
const REGISTRATION_COLUMNS = `${BASE_COLUMNS}, status`;
const REGISTRATION_COLUMNS_WITHOUT_STATUS = BASE_COLUMNS;

function fetchRegistrations(
  supabase: SupabaseClient,
  columns: string,
) {
  return supabase
    .from('registrations')
    .select(columns)
    .order('submitted_at', { ascending: false });
}

export async function getRegistrations(
  client?: SupabaseClient,
): Promise<AdminRegistrationRow[] | null> {
  const supabase = client ?? createServerSupabaseClient();
  const { data, error } = await fetchRegistrations(supabase, REGISTRATION_COLUMNS);

  if (error || !data) {
    const retry = await fetchRegistrations(supabase, REGISTRATION_COLUMNS_WITHOUT_STATUS);
    if (retry.error || !retry.data) {
      console.error('Failed to load registrations:', error);
      return null;
    }
    return (retry.data as unknown as RegistrationRecord[]).map(toRegistrationRow);
  }

  return (data as unknown as RegistrationRecord[]).map(toRegistrationRow);
}

export async function deleteRegistration(
  reference: string,
  client?: SupabaseClient,
): Promise<boolean> {
  const supabase = client ?? createServerSupabaseClient();
  const { error } = await supabase.from('registrations').delete().eq('reference', reference);

  if (error) {
    console.error('Failed to delete registration:', error);
    return false;
  }

  return true;
}

export async function setRegistrationStatus(
  reference: string,
  status: RegistrationStatus,
  client?: SupabaseClient,
): Promise<boolean> {
  const supabase = client ?? createServerSupabaseClient();
  const { error } = await supabase
    .from('registrations')
    .update({ status })
    .eq('reference', reference);

  if (error) {
    console.error('Failed to update registration status:', error);
    return false;
  }

  return true;
}