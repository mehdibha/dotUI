'use client'

import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type {
  ColumnDef,
  SortingState,
  Table as TanstackTable,
} from '@tanstack/react-table'
import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from 'lucide-react'

import { Button } from '@/registry/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from '@/registry/ui/table'

import { useStyles } from './styles'

// MARK: DataGrid

interface DataGridProps<TData> extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {
  /** Column definitions, in TanStack Table's `ColumnDef` shape. */
  columns: ColumnDef<TData>[]
  /** The rows to render. */
  data: TData[]
  /** Accessible label for the underlying table. */
  'aria-label'?: string
  /** Number of rows shown per page. @default 10 */
  pageSize?: number
  /** Whether to render the pagination footer. @default true */
  pagination?: boolean
  /** Rendered when there are no rows to display. */
  renderEmptyState?: () => React.ReactNode
}

function DataGrid<TData>({
  columns,
  data,
  pageSize = 10,
  pagination = true,
  renderEmptyState = () => 'No results found.',
  className,
  'aria-label': ariaLabel = 'Data grid',
  ...props
}: DataGridProps<TData>) {
  const { root } = useStyles()()
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    initialState: pagination ? { pagination: { pageSize } } : undefined,
  })

  const rows = table.getRowModel().rows

  return (
    <div className={root({ className })} {...props}>
      <TableContainer>
        <Table aria-label={ariaLabel}>
          <TableHeader>
            {table.getFlatHeaders().map((header) => (
              <TableColumn
                key={header.id}
                isRowHeader={header.index === 0}
                style={
                  header.column.getSize() === 150
                    ? undefined
                    : { width: header.getSize() }
                }
              >
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  <DataGridSortButton header={header} />
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )
                )}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  {renderEmptyState()}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((tableRow) => (
                <TableRow key={tableRow.id}>
                  {tableRow.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && <DataGridPagination table={table} />}
    </div>
  )
}

// MARK: DataGridSortButton

interface DataGridSortButtonProps<TData> {
  // The header is generic over the column's value type, which DataGrid does not
  // expose, so the cell value is left `unknown`.
  header: ReturnType<TanstackTable<TData>['getFlatHeaders']>[number]
}

function DataGridSortButton<TData>({ header }: DataGridSortButtonProps<TData>) {
  const { sortButton, sortLabel, sortIcon } = useStyles()()
  const sorted = header.column.getIsSorted()

  return (
    <button
      type="button"
      data-sorted={sorted ? sorted : undefined}
      aria-label={`Sort by ${header.column.id}`}
      className={sortButton()}
      onClick={header.column.getToggleSortingHandler()}
    >
      <span className={sortLabel()}>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </span>
      {sorted === 'asc' ? (
        <ChevronUpIcon aria-hidden className={sortIcon()} />
      ) : sorted === 'desc' ? (
        <ChevronDownIcon aria-hidden className={sortIcon()} />
      ) : (
        <ArrowUpDownIcon aria-hidden className={sortIcon()} />
      )}
    </button>
  )
}

// MARK: DataGridPagination

interface DataGridPaginationProps<TData> {
  table: TanstackTable<TData>
}

function DataGridPagination<TData>({ table }: DataGridPaginationProps<TData>) {
  const { footer, pageInfo, actions } = useStyles()()
  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount()

  return (
    <div className={footer()}>
      <p className={pageInfo()}>
        Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
      </p>
      <div className={actions()}>
        <Button
          variant="default"
          size="sm"
          isDisabled={!table.getCanPreviousPage()}
          onPress={() => table.previousPage()}
        >
          <ChevronLeftIcon />
          Previous
        </Button>
        <Button
          variant="default"
          size="sm"
          isDisabled={!table.getCanNextPage()}
          onPress={() => table.nextPage()}
        >
          Next
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}

// MARK: Separator

export type { DataGridProps }
export { DataGrid }
