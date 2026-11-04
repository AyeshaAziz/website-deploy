import type { ReactNode } from 'react';
import type { AdminEnquiryRow } from '@/lib/admin/interfaces/enquiries';
import { EnquiryStatusToggle } from './EnquiryStatusToggle';

interface EnquiriesTableProps {
  rows: AdminEnquiryRow[];
}

const HEADERS = ['Received', 'Name', 'Email', 'Department', 'Message', 'Status'];

export function EnquiriesTable({ rows }: EnquiriesTableProps): ReactNode {
  return (
    <div className="overflow-hidden rounded-card bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-primary-5 bg-primary-6/50 font-semibold uppercase tracking-wide text-primary-neg1">
              {HEADERS.map((header) => (
                <th key={header} className="px-4 py-3 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={HEADERS.length} className="px-4 py-10 text-center text-neutral-600">
                  No enquiries yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-primary-5/50 hover:bg-primary-6/40">
                  <td className="px-4 py-3">{new Date(row.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.department}</td>
                  <td className="px-4 py-3 whitespace-normal">{row.message}</td>
                  <td className="px-4 py-3">
                    <EnquiryStatusToggle id={row.id} status={row.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
