'use client';

import { useMemo, type ReactNode } from 'react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { deleteEnquiryAction } from '@/app/admin/actions';
import type { AdminEnquiryRow } from '@/lib/admin/interfaces/enquiries';
import { AdminDataGrid } from '../grid/AdminDataGrid';
import { DeleteRowButton } from './DeleteRowButton';
import { EnquiryStatusToggle } from './EnquiryStatusToggle';

interface EnquiriesTableProps {
  rows: AdminEnquiryRow[];
}

function StatusCellRenderer(params: ICellRendererParams<AdminEnquiryRow>): ReactNode {
  if (!params.data) return null;
  return <EnquiryStatusToggle id={params.data.id} status={params.data.status} />;
}

function DeleteCellRenderer(params: ICellRendererParams<AdminEnquiryRow>): ReactNode {
  if (!params.data) return null;
  return (
    <DeleteRowButton
      action={deleteEnquiryAction}
      fieldName="id"
      value={String(params.data.id)}
      itemLabel={`enquiry from ${params.data.name}`}
    />
  );
}

const COLUMN_DEFS: ColDef<AdminEnquiryRow>[] = [
  {
    field: 'createdAt',
    headerName: 'Received',
    valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleString() : ''),
  },
  { field: 'name', headerName: 'Name' },
  { field: 'email', headerName: 'Email' },
  { field: 'department', headerName: 'Department' },
  { field: 'message', headerName: 'Message' },
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

export function EnquiriesTable({ rows }: EnquiriesTableProps): ReactNode {
  const rowData = useMemo(() => rows, [rows]);

  return (
    <AdminDataGrid
      rows={rowData}
      columnDefs={COLUMN_DEFS}
      quickFilterLabel="Quick filter enquiries"
      getRowId={(row) => String(row.id)}
      storageKey="enquiries"
      defaultFilterModel={{
        status: { filterType: 'text', type: 'equals', filter: 'TODO' },
      }}
    />
  );
}