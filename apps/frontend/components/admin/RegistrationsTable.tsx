import type { ReactNode } from 'react';
import { Container } from '@itqa/ui';
import { createServerSupabaseClient } from '@/utils/supabase/server';

interface RegistrationRow {
  reference: string;
  first_name: string;
  last_name: string;
  track: string;
  course: string;
  email: string;
  submitted_at: string;
}

export async function RegistrationsTable(): Promise<ReactNode> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('registrations')
    .select('reference, first_name, last_name, track, course, email, submitted_at')
    .order('submitted_at', { ascending: false });

  if (error || !data) {
    return (
      <Container className="py-section-sm">
        <p className="text-danger">Could not load registrations.</p>
      </Container>
    );
  }

  const rows = data as RegistrationRow[];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-small">
        <thead className="border-b border-primary-5 text-neutral-700">
          <tr>
            <th className="py-2 pr-4">Reference</th>
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Track</th>
            <th className="py-2 pr-4">Course</th>
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.reference} className="border-b border-primary-5/50">
              <td className="py-2 pr-4 font-mono">{row.reference}</td>
              <td className="py-2 pr-4">
                {row.first_name} {row.last_name}
              </td>
              <td className="py-2 pr-4">{row.track}</td>
              <td className="py-2 pr-4">{row.course}</td>
              <td className="py-2 pr-4">{row.email}</td>
              <td className="py-2 pr-4">{new Date(row.submitted_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="mt-4 text-neutral-600">No registrations yet.</p>}
    </div>
  );
}
