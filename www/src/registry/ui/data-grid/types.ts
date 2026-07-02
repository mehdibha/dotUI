import type { ColumnDef } from '@tanstack/react-table'

/**
 * An advanced data grid built on TanStack Table over the dotUI Table. Accepts
 * TanStack `ColumnDef`s and a `data` array, and adds click-to-toggle column
 * sorting and Previous/Next pagination on top of the accessible table.
 */
export interface DataGridProps<TData> extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {
  /**
   * Column definitions, in TanStack Table's `ColumnDef` shape. Set
   * `enableSorting: false` on a column to make its header non-sortable.
   */
  columns: ColumnDef<TData>[]

  /**
   * The rows to render. Sorting and pagination are derived from this array.
   */
  data: TData[]

  /**
   * Accessible label for the underlying table.
   * @default "Data grid"
   */
  'aria-label'?: string

  /**
   * Number of rows shown per page.
   * @default 10
   */
  pageSize?: number

  /**
   * Whether to render the pagination footer.
   * @default true
   */
  pagination?: boolean

  /**
   * Rendered inside the table body when there are no rows to display.
   */
  renderEmptyState?: () => React.ReactNode
}
