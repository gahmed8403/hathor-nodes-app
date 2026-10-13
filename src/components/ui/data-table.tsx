'use client'

import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, Search } from 'lucide-react'
import { cn } from '@/lib/format'

export type { ColumnDef }

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'Search…',
  initialSort,
  pageSize = 10,
  toolbar,
}: {
  data: T[]
  columns: ColumnDef<T, any>[] // eslint-disable-line @typescript-eslint/no-explicit-any
  searchPlaceholder?: string
  initialSort?: SortingState
  pageSize?: number
  toolbar?: React.ReactNode
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSort ?? [])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  const { pageIndex } = table.getState().pagination
  const rowCount = table.getFilteredRowModel().rows.length

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 sm:max-w-xs">
          <span className="sr-only">Search table</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2 pl-9 pr-4 text-sm text-mist-50 placeholder:text-mist-500 focus:border-sun-400/50 focus:outline-none focus:ring-2 focus:ring-sun-400/20"
          />
        </label>
        {toolbar}
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/5">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-white/[0.025]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const sorted = header.column.getIsSorted()
                  const canSort = header.column.getCanSort()
                  const align = (header.column.columnDef.meta as { align?: string } | undefined)?.align
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
                      className={cn(
                        'whitespace-nowrap px-3 py-3 text-xs font-medium uppercase tracking-wider text-mist-500',
                        align === 'right' && 'text-right',
                      )}
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn('inline-flex items-center gap-1.5 uppercase hover:text-mist-100', sorted && 'text-mist-100')}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === 'asc' ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : sorted === 'desc' ? (
                            <ArrowDown className="h-3 w-3" />
                          ) : (
                            <ChevronsUpDown className="h-3 w-3 opacity-40" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/5">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-white/[0.02]">
                {row.getVisibleCells().map((cell) => {
                  const align = (cell.column.columnDef.meta as { align?: string } | undefined)?.align
                  return (
                    <td
                      key={cell.id}
                      className={cn('whitespace-nowrap px-3 py-3 text-mist-300', align === 'right' && 'text-right font-mono tabular-nums')}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                })}
              </tr>
            ))}
            {rowCount === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-mist-500">
                  No results match “{globalFilter}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-mist-500">
        <p>
          {rowCount === 0
            ? '0 rows'
            : `${pageIndex * table.getState().pagination.pageSize + 1}–${Math.min(
                (pageIndex + 1) * table.getState().pagination.pageSize,
                rowCount,
              )} of ${rowCount}`}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-mist-300 hover:text-mist-50 disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-2 font-mono">
            {pageIndex + 1} / {Math.max(1, table.getPageCount())}
          </span>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-mist-300 hover:text-mist-50 disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
