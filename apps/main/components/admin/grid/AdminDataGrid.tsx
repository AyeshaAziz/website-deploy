'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { AllCommunityModule, type ColDef, type FilterModel } from 'ag-grid-community';
import { AgGridProvider, AgGridReact } from 'ag-grid-react';

import {
  getHiddenColumns,
  subscribeHiddenColumns,
  toggleHiddenColumn,
} from './columnVisibilityStore';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

export interface AdminDataGridProps<T> {
  rows: T[];
  columnDefs: ColDef<T>[];
  quickFilterLabel: string;
  quickFilterPlaceholder?: string;
  getRowId?: (row: T) => string;
  pageSize?: number;
  defaultFilterModel?: FilterModel;
  /** Persists column visibility under this key across tabs, navigation, and reloads. */
  storageKey: string;
}

const MODULES = [AllCommunityModule];

const DEFAULT_COL_DEF: ColDef = {
  filter: true,
  floatingFilter: true,
  sortable: true,
  resizable: true,
};

interface ColumnOption {
  id: string;
  label: string;
}

export function AdminDataGrid<T>({
  rows,
  columnDefs,
  quickFilterLabel,
  quickFilterPlaceholder = 'Quick filter...',
  getRowId,
  pageSize = 20,
  defaultFilterModel,
  storageKey,
}: AdminDataGridProps<T>): ReactNode {
  const gridRef = useRef<AgGridReact<T>>(null);
  const [quickFilter, setQuickFilter] = useState('');
  const rowData = useMemo(() => rows, [rows]);

  const subscribe = useCallback(
    (listener: () => void) => subscribeHiddenColumns(storageKey, listener),
    [storageKey],
  );
  const getSnapshot = useCallback(() => getHiddenColumns(storageKey), [storageKey]);
  const hiddenColumns = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const columnOptions = useMemo<ColumnOption[]>(
    () =>
      columnDefs.flatMap((column) => {
        const id = column.colId ?? column.field;
        if (!id || !column.headerName) return [];
        return [{ id, label: column.headerName }];
      }),
    [columnDefs],
  );

  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    for (const column of columnOptions) {
      api.setColumnsVisible([column.id], !hiddenColumns[column.id]);
    }
  }, [columnOptions, hiddenColumns]);

  function applyVisibility(): void {
    const api = gridRef.current?.api;
    if (!api) return;
    for (const column of columnOptions) {
      api.setColumnsVisible([column.id], !hiddenColumns[column.id]);
    }
  }

  return (
    <AgGridProvider modules={MODULES}>
      <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
        <div className="flex shrink-0 items-center gap-3">
          <input
            type="search"
            value={quickFilter}
            onChange={(event) => setQuickFilter(event.target.value)}
            placeholder={quickFilterPlaceholder}
            className="rounded-input border border-primary-5 bg-white px-3 py-1.5 text-small text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-6"
            aria-label={quickFilterLabel}
          />
          {columnOptions.length > 0 && (
            <details className="relative">
              <summary className="cursor-pointer list-none rounded-input border border-primary-5 bg-white px-3 py-1.5 text-small font-medium text-primary-neg1 hover:bg-primary-6">
                Columns
              </summary>
              <fieldset className="absolute right-0 z-10 mt-1 max-h-64 w-56 overflow-auto rounded-card border border-primary-5 bg-white p-3 shadow-card">
                <legend className="sr-only">Show or hide columns</legend>
                {columnOptions.map((column) => (
                  <label
                    key={column.id}
                    className="flex cursor-pointer items-center gap-2 py-1 text-small text-neutral-800"
                  >
                    <input
                      type="checkbox"
                      checked={!hiddenColumns[column.id]}
                      onChange={() => toggleHiddenColumn(storageKey, column.id)}
                    />
                    {column.label}
                  </label>
                ))}
              </fieldset>
            </details>
          )}
        </div>
        <div className="relative min-h-[40vh] flex-1">
          <div className="ag-theme-quartz absolute inset-0 overflow-hidden rounded-card">
            <AgGridReact<T>
              ref={gridRef}
              theme="legacy"
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={DEFAULT_COL_DEF}
              quickFilterText={quickFilter}
              getRowId={getRowId ? (params) => getRowId(params.data) : undefined}
              initialState={
                defaultFilterModel ? { filter: { filterModel: defaultFilterModel } } : undefined
              }
              onGridReady={applyVisibility}
              pagination
              paginationPageSize={pageSize}
            />
          </div>
        </div>
      </div>
    </AgGridProvider>
  );
}
