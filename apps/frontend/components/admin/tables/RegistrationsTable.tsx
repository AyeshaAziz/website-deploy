import type { ReactNode } from 'react';
import type { AdminRegistrationRow } from '@/lib/admin/interfaces/registrations';
import { RegistrationsTableRow } from './RegistrationsTableRow';

interface RegistrationsTableProps {
  rows: AdminRegistrationRow[];
}

const HEADERS = [
  'Reference',
  'Name',
  'Track',
  'Course',
  'Course Language',
  'Second Language',
  'AIMS No',
  'Tanzeem',
  'Country',
  'City',
  'Phone',
  'Email',
  'Teaching Experience',
  'Teaching Role',
  'Commit Days',
  'Available Times',
  'Submitted',
  'Status',
];

export function RegistrationsTable({ rows }: RegistrationsTableProps): ReactNode {
  return (
    <div className="overflow-hidden rounded-card bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-primary-5 bg-primary-6/50 font-semibold uppercase tracking-wide text-primary-neg1">
              {HEADERS.map((header) => (
                <th key={header} className="whitespace-nowrap px-4 py-3 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={HEADERS.length} className="px-4 py-10 text-center text-neutral-600">
                  No registrations yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => <RegistrationsTableRow key={row.reference} row={row} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
