import type { ReactNode } from 'react';
import { Badge } from '@itqa/ui';
import type { AdminRegistrationRow } from '@/lib/admin/interfaces/registrations';
import { StatusToggle } from './StatusToggle';

interface RegistrationsTableRowProps {
  row: AdminRegistrationRow;
}

function TableCell({ value }: { value?: string }): ReactNode {
  return <td className="px-4 py-3">{value ?? '—'}</td>;
}

export function RegistrationsTableRow({ row }: RegistrationsTableRowProps): ReactNode {
  return (
    <tr className="border-b border-primary-5/50 align-top hover:bg-primary-6/40">
      <td className="whitespace-nowrap px-4 py-3 font-mono">{row.reference}</td>
      <td className="whitespace-nowrap px-4 py-3">
        {row.firstName} {row.lastName}
      </td>
      <td className="px-4 py-3">
        <Badge tone="primary" className="uppercase">
          {row.track}
        </Badge>
      </td>
      <TableCell value={row.course} />
      <TableCell value={row.courseLanguage} />
      <TableCell value={row.secondLanguage} />
      <TableCell value={row.aimsNo} />
      <TableCell value={row.tanzeem} />
      <TableCell value={row.country} />
      <TableCell value={row.city} />
      <TableCell value={row.phone} />
      <td className="px-4 py-3">{row.email}</td>
      <TableCell value={row.teachingExperience} />
      <TableCell value={row.teachingRole} />
      <TableCell value={row.commitDays} />
      <TableCell value={row.availableTimes} />
      <td className="whitespace-nowrap px-4 py-3">
        {new Date(row.submittedAt).toLocaleString()}
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <StatusToggle reference={row.reference} status={row.status} />
      </td>
    </tr>
  );
}
