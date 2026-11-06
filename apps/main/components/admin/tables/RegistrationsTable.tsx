'use client';

import { useMemo, type ReactNode } from 'react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Badge } from '@itqa/ui';
import { deleteRegistrationAction } from '@/app/admin/actions';
import type { AdminRegistrationRow } from '@/lib/admin/interfaces/registrations';
import { AdminDataGrid } from '../grid/AdminDataGrid';
import { DeleteRowButton } from './DeleteRowButton';
import { StatusToggle } from './StatusToggle';

interface RegistrationsTableProps {
  rows: AdminRegistrationRow[];
}

interface GridRow extends AdminRegistrationRow {
  name: string;
}

function TrackCellRenderer(params: ICellRendererParams<GridRow>): ReactNode {
  if (!params.value) return null;
  return (
    <Badge tone="primary" className="uppercase">
      {params.value}
    </Badge>
  );
}

function StatusCellRenderer(params: ICellRendererParams<GridRow>): ReactNode {
  if (!params.data) return null;
  return <StatusToggle reference={params.data.reference} status={params.data.status} />;
}

function DeleteCellRenderer(params: ICellRendererParams<GridRow>): ReactNode {
  if (!params.data) return null;
  return (
    <DeleteRowButton
      action={deleteRegistrationAction}
      fieldName="reference"
      value={params.data.reference}
      itemLabel={`registration ${params.data.reference}`}
    />
  );
}

const COLUMN_DEFS: ColDef<GridRow>[] = [
  { field: 'reference', headerName: 'Reference' },
  { field: 'name', headerName: 'Name' },
  { field: 'track', headerName: 'Track', cellRenderer: TrackCellRenderer },
  { field: 'course', headerName: 'Course' },
  { field: 'courseLanguage', headerName: 'Course Language' },
  { field: 'secondLanguage', headerName: 'Second Language' },
  { field: 'aimsNo', headerName: 'AIMS No' },
  { field: 'tanzeem', headerName: 'Tanzeem' },
  { field: 'country', headerName: 'Country' },
  { field: 'city', headerName: 'City' },
  { field: 'phone', headerName: 'Phone' },
  { field: 'email', headerName: 'Email' },
  { field: 'teachingExperience', headerName: 'Teaching Experience' },
  { field: 'teachingRole', headerName: 'Teaching Role' },
  { field: 'commitDays', headerName: 'Commit Days' },
  { field: 'availableTimes', headerName: 'Available Times' },
  {
    field: 'submittedAt',
    headerName: 'Submitted',
    valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleString() : ''),
  },
  { field: 'status', headerName: 'Status', cellRenderer: StatusCellRenderer },
  {
    headerName: '',
    colId: 'delete',
    width: 150,
    sortable: false,
    filter: false,
    floatingFilter: false,
    resizable: false,
    cellRenderer: DeleteCellRenderer,
  },
];

export function RegistrationsTable({ rows }: RegistrationsTableProps): ReactNode {
  const rowData = useMemo<GridRow[]>(
    () => rows.map((row) => ({ ...row, name: `${row.firstName} ${row.lastName}`.trim() })),
    [rows],
  );
  return (
    <AdminDataGrid
      rows={rowData}
      columnDefs={COLUMN_DEFS}
      quickFilterLabel="Quick filter registrations"
      getRowId={(row) => row.reference}
      storageKey="registrations"
      defaultFilterModel={{
        status: { filterType: 'text', type: 'equals', filter: 'TODO' },
      }}
    />
  );
}
