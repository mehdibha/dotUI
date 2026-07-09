'use client'

import * as React from 'react'
import { ArrowUpIcon, ChevronRightIcon, GripVerticalIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'
import * as CollectionPrimitives from 'react-aria-components/Collection'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as TablePrimitives from 'react-aria-components/Table'
import * as DragAndDropPrimitives from 'react-aria-components/useDragAndDrop'
import * as VirtualizerPrimitives from 'react-aria-components/Virtualizer'
import type { GridNode } from 'react-stately/private/grid/GridCollection'
import type { LayoutNode } from 'react-stately/useVirtualizerState'
import { tv } from 'tailwind-variants'

import { cn } from '@/lib/utils'
import { Checkbox } from '@/ui/checkbox'
import { Loader } from '@/ui/loader'
const tableVariants = tv({
  slots: {
    container:
      'relative isolate min-h-0 w-full scroll-pt-10 overflow-auto rounded-md border border-border bg-bg',
    table: ['min-w-full text-sm text-fg outline-hidden select-none', 'text-sm'],
    header:
      'sticky top-0 z-10 bg-bg/95 backdrop-blur supports-[-moz-appearance:none]:bg-bg',
    column: [
      'box-border h-10 cursor-default border-b border-border bg-bg/95 px-2.5 text-left align-middle font-medium whitespace-nowrap text-fg-muted focus-reset outline-hidden backdrop-blur supports-[-moz-appearance:none]:bg-bg',
      '[&:is(div)]:flex [&:is(div)]:h-full [&:is(div)]:items-center',
      "relative hover:text-fg focus-visible:z-20 focus-visible:text-fg focus-visible:before:pointer-events-none focus-visible:before:absolute focus-visible:before:inset-0 focus-visible:before:rounded-md focus-visible:before:[outline:2px_solid_var(--color-border-focus)] focus-visible:before:[outline-offset:-2px] focus-visible:before:content-['']",
      'h-10 px-2.5',
    ],
    columnContent: 'flex h-full min-w-0 items-center gap-1.5',
    columnLabel: 'min-w-0 flex-1 truncate',
    chromeColumn: [
      'box-border h-10 border-b border-border bg-bg/95 px-0 text-left align-middle focus-reset outline-hidden backdrop-blur supports-[-moz-appearance:none]:bg-bg',
      '[&:is(div)]:flex [&:is(div)]:h-full [&:is(div)]:items-center',
      "relative focus-visible:z-20 focus-visible:before:pointer-events-none focus-visible:before:absolute focus-visible:before:inset-0 focus-visible:before:rounded-md focus-visible:before:[outline:2px_solid_var(--color-border-focus)] focus-visible:before:[outline-offset:-2px] focus-visible:before:content-['']",
      'h-10',
    ],
    selectionColumn: ['w-10 min-w-10 px-2.5', 'px-2.5'],
    sortIndicator:
      'size-3.5 shrink-0 text-fg-muted transition-transform duration-150',
    resizer: [
      'h-5 w-px translate-x-2 cursor-col-resize rounded-xs bg-border bg-clip-content px-2 py-1 focus-reset focus-visible:focus-ring',
      'resizing:w-0.5 resizing:bg-border-focus resizing:pl-[7px]',
    ],
    body: 'data-[empty]:h-24 data-[empty]:text-center data-[empty]:text-fg-muted',
    footer:
      'border-t bg-muted/50 font-medium [&_[role=row]]:last:border-b-0 [&>tr]:last:border-b-0',
    row: [
      'group/row relative box-border cursor-default border-b border-border bg-bg/70 focus-reset transition-colors [&:is(div)]:h-full',
      'hover:bg-muted/50 data-[state=selected]:bg-accent-muted pressed:bg-muted/70 selected:bg-accent-muted dragging:cursor-grabbing dragging:bg-accent-muted/70 dragging:text-fg dragging:opacity-70 drop-target:bg-accent-muted/70',
      'focus-visible:bg-accent-muted/70 disabled:text-fg-disabled focus-visible:[&>*:first-child]:shadow-[inset_3px_0_0_0_var(--color-border-focus)]',
    ],
    cell: [
      'relative box-border h-10 align-middle leading-5 whitespace-nowrap focus-reset outline-hidden',
      'bg-clip-padding px-2.5',
      '[&:is(div)]:flex [&:is(div)]:h-full [&:is(div)]:w-full [&:is(div)]:items-center',
      '[&.text-center]:justify-center [&.text-right]:justify-end',
      "focus-visible:z-20 focus-visible:before:pointer-events-none focus-visible:before:absolute focus-visible:before:inset-0 focus-visible:before:rounded-md focus-visible:before:[outline:2px_solid_var(--color-border-focus)] focus-visible:before:[outline-offset:-2px] focus-visible:before:content-[''] data-[focus-visible]:z-20 data-[focus-visible]:before:pointer-events-none data-[focus-visible]:before:absolute data-[focus-visible]:before:inset-0 data-[focus-visible]:before:rounded-md data-[focus-visible]:before:[outline:2px_solid_var(--color-border-focus)] data-[focus-visible]:before:[outline-offset:-2px] data-[focus-visible]:before:content-['']",
      'h-10 px-2.5 leading-5',
    ],
    selectionCell: [
      'w-10 min-w-10 px-2.5',
      '[&:is(div)]:h-[calc(100%-1px)] [&:is(div)]:justify-start',
      'px-2.5',
    ],
    dragCell: [
      'w-8 min-w-8 cursor-grab px-1 text-fg-muted group-data-[dragging]/row:cursor-grabbing',
      '[&:is(div)]:justify-center',
      'px-1',
    ],
    dragButton: [
      'inline-flex size-6 cursor-grab items-center justify-center rounded-sm text-fg-muted focus-reset transition-colors focus-visible:focus-ring',
      'group-hover/row:text-fg group-data-[dragging]/row:cursor-grabbing focus-visible:bg-muted focus-visible:text-fg **:[svg]:size-4',
    ],
    dropIndicator: 'relative z-20 h-0 focus-reset outline-hidden',
    dropIndicatorLine: [
      'pointer-events-none relative z-30 block h-0 w-full opacity-0 transition-opacity',
      "before:absolute before:inset-x-2 before:top-0 before:h-0.5 before:-translate-y-1/2 before:rounded-full before:bg-border-focus before:shadow-[0_0_0_1px_var(--color-bg)] before:content-['']",
    ],
    expandButton: [
      'mr-1 -ml-1 inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-fg-muted focus-reset focus-visible:focus-ring',
      'hover:bg-muted disabled:text-fg-disabled',
    ],
    expandIcon: 'size-3.5 transition-transform duration-150',
    loadMore: [
      'relative h-7 **:data-[slot=loader]:absolute **:data-[slot=loader]:top-0 **:data-[slot=loader]:left-1/2 **:data-[slot=loader]:-translate-x-1/2',
      '[&_[data-slot=loader]_svg]:size-4',
    ],
  },
})

class TableLayout<T> extends VirtualizerPrimitives.TableLayout<T> {
  protected override buildRow(
    node: GridNode<T>,
    x: number,
    y: number,
  ): LayoutNode {
    const layoutNode = super.buildRow(node, x, y)
    layoutNode.layoutInfo.allowOverflow = true
    return layoutNode
  }

  protected override buildColumn(
    node: GridNode<T>,
    x: number,
    y: number,
  ): LayoutNode {
    const layoutNode = super.buildColumn(node, x, y)
    layoutNode.layoutInfo.allowOverflow = true
    return layoutNode
  }
}

interface TableVirtualizerProps<T extends object> extends Omit<
  VirtualizerPrimitives.VirtualizerProps<T>,
  'layout'
> {
  rowHeight?: number
  headingHeight?: number
}

const TABLE_VIRTUALIZER_HEIGHTS = {
  compact: 32,
  default: 40,
  comfortable: 48,
} as const

const TableVirtualizer = <T extends object>({
  headingHeight,
  layoutOptions,
  rowHeight,
  ...props
}: TableVirtualizerProps<T>) => {
  const densityHeight = TABLE_VIRTUALIZER_HEIGHTS.default
  const tableLayoutOptions = layoutOptions as
    | { rowHeight?: number; headingHeight?: number }
    | undefined

  return (
    <VirtualizerPrimitives.Virtualizer
      layout={TableLayout}
      layoutOptions={{
        ...layoutOptions,
        rowHeight: rowHeight ?? tableLayoutOptions?.rowHeight ?? densityHeight,
        headingHeight:
          headingHeight ?? tableLayoutOptions?.headingHeight ?? densityHeight,
      }}
      {...props}
    />
  )
}

const TableContainerContext = React.createContext({ resizable: false })

interface TableContainerProps extends React.ComponentPropsWithoutRef<
  typeof TablePrimitives.ResizableTableContainer
> {
  resizable?: boolean
}

const TableContainer = React.forwardRef<HTMLDivElement, TableContainerProps>(
  (
    {
      className,
      onResize,
      onResizeEnd,
      onResizeStart,
      render,
      resizable = false,
      ...props
    },
    ref,
  ) => {
    const { container } = tableVariants()
    const classNames = container({ className })
    const context = React.useMemo(() => ({ resizable }), [resizable])

    if (resizable) {
      return (
        <TableContainerContext.Provider value={context}>
          <TablePrimitives.ResizableTableContainer
            data-slot="table-container"
            className={classNames}
            ref={ref}
            onResize={onResize}
            onResizeEnd={onResizeEnd}
            onResizeStart={onResizeStart}
            render={render}
            {...props}
          />
        </TableContainerContext.Provider>
      )
    }

    return (
      <TableContainerContext.Provider value={context}>
        <div
          data-slot="table-container"
          className={classNames}
          ref={ref}
          {...props}
        />
      </TableContainerContext.Provider>
    )
  },
)
TableContainer.displayName = 'TableContainer'

interface TableProps extends React.ComponentProps<
  typeof TablePrimitives.Table
> {}

const Table = ({ className, ...props }: TableProps) => {
  const { table } = tableVariants()

  return (
    <TablePrimitives.Table
      data-slot="table"
      className={composeRenderProps(className, (cn) =>
        table({ className: cn }),
      )}
      {...props}
    />
  )
}

interface TableHeaderProps<
  T extends object,
> extends TablePrimitives.TableHeaderProps<T> {}

const TableHeader = <T extends object>({
  className,
  columns,
  children,
  dependencies,
  ...props
}: TableHeaderProps<T>) => {
  const { header, selectionColumn } = tableVariants()
  const { resizable } = React.useContext(TableContainerContext)
  const { selectionBehavior, selectionMode, allowsDragging } =
    TablePrimitives.useTableOptions()
  const dragColumnSize = resizable ? { minWidth: 32, width: 32 } : undefined
  const selectionColumnSize = resizable
    ? { minWidth: 40, width: 40 }
    : undefined

  return (
    <TablePrimitives.TableHeader
      data-slot="table-header"
      className={composeRenderProps(className, (cn) =>
        header({ className: cn }),
      )}
      dependencies={dependencies}
      {...props}
    >
      {allowsDragging && (
        <TableChromeColumn className="w-8 min-w-8" {...dragColumnSize} />
      )}
      {selectionBehavior === 'toggle' && (
        <TableChromeColumn
          className={selectionColumn()}
          {...selectionColumnSize}
        >
          {selectionMode === 'multiple' && <Checkbox slot="selection" />}
        </TableChromeColumn>
      )}
      <CollectionPrimitives.Collection
        items={columns}
        dependencies={dependencies}
      >
        {children}
      </CollectionPrimitives.Collection>
    </TablePrimitives.TableHeader>
  )
}

interface InternalColumnProps extends React.ComponentProps<
  typeof TablePrimitives.Column
> {}

const TableChromeColumn = ({
  children,
  className,
  ...props
}: InternalColumnProps) => {
  const { chromeColumn } = tableVariants()
  return (
    <TablePrimitives.Column
      data-slot="table-chrome-column"
      className={composeRenderProps(className, (cn) =>
        chromeColumn({ className: cn }),
      )}
      {...props}
    >
      {children}
    </TablePrimitives.Column>
  )
}

interface TableColumnProps extends React.ComponentProps<
  typeof TablePrimitives.Column
> {
  allowsResizing?: boolean
}

const TableColumn = ({
  allowsResizing,
  children,
  className,
  ...props
}: TableColumnProps) => {
  const { column, columnContent, columnLabel, resizer, sortIndicator } =
    tableVariants()
  const { resizable } = React.useContext(TableContainerContext)
  return (
    <TablePrimitives.Column
      data-slot="table-column"
      className={composeRenderProps(className, (cn) =>
        column({ className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { allowsSorting, sortDirection }) => (
          <div className={columnContent()}>
            <span className={columnLabel()}>{children}</span>
            {allowsSorting && sortDirection && (
              <ArrowUpIcon
                aria-hidden
                className={sortIndicator({
                  className:
                    sortDirection === 'descending' ? 'rotate-180' : undefined,
                })}
              />
            )}
            {resizable && !props.width && allowsResizing && (
              <TablePrimitives.ColumnResizer className={resizer()} />
            )}
          </div>
        ),
      )}
    </TablePrimitives.Column>
  )
}

interface TableBodyProps<
  T extends object,
> extends TablePrimitives.TableBodyProps<T> {
  isLoading?: boolean
  onLoadMore?: () => void
}

const TableBody = <T extends object>({
  renderEmptyState = () => 'No results found.',
  children,
  className,
  items,
  isLoading,
  onLoadMore,
  dependencies,
  ...props
}: TableBodyProps<T>) => {
  const { body } = tableVariants()
  return (
    <TablePrimitives.TableBody
      renderEmptyState={renderEmptyState}
      className={composeRenderProps(className, (className) =>
        body({ className }),
      )}
      dependencies={dependencies}
      {...props}
    >
      {items !== undefined ? (
        <CollectionPrimitives.Collection
          items={items}
          dependencies={dependencies}
        >
          {children}
        </CollectionPrimitives.Collection>
      ) : (
        (children as React.ReactNode)
      )}
      {(isLoading || onLoadMore) && (
        <TableLoadMore isLoading={isLoading} onLoadMore={onLoadMore} />
      )}
    </TablePrimitives.TableBody>
  )
}

interface TableFooterProps<
  T extends object,
> extends TablePrimitives.TableFooterProps<T> {}

const TableFooter = <T extends object>({
  className,
  children,
  dependencies,
  items,
  ...props
}: TableFooterProps<T>) => {
  const { footer } = tableVariants()
  return (
    <TablePrimitives.TableFooter
      data-slot="table-footer"
      className={footer({ className })}
      dependencies={dependencies}
      {...props}
    >
      <CollectionPrimitives.Collection
        items={items}
        dependencies={dependencies}
      >
        {children}
      </CollectionPrimitives.Collection>
    </TablePrimitives.TableFooter>
  )
}

interface TableRowProps<T extends object> extends TablePrimitives.RowProps<T> {}

function TableRow<T extends object>({
  columns,
  children,
  className,
  dependencies,
  ...props
}: TableRowProps<T>) {
  const { dragButton, dragCell, row, selectionCell } = tableVariants()
  const { selectionBehavior, allowsDragging } =
    TablePrimitives.useTableOptions()

  return (
    <TablePrimitives.Row
      data-slot="table-row"
      className={composeRenderProps(
        className,
        (className, { isFocusVisibleWithin }) =>
          row({
            className: cn(
              className,
              isFocusVisibleWithin &&
                'bg-accent-muted/70 hover:bg-accent-muted/70 selected:bg-accent-muted',
            ),
          }),
      )}
      dependencies={dependencies}
      {...props}
    >
      {allowsDragging && (
        <TableCell className={dragCell()}>
          <ButtonPrimitives.Button slot="drag" className={dragButton()}>
            <GripVerticalIcon aria-hidden />
          </ButtonPrimitives.Button>
        </TableCell>
      )}
      {selectionBehavior === 'toggle' && (
        <TableCell className={selectionCell()}>
          <Checkbox slot="selection" />
        </TableCell>
      )}
      <CollectionPrimitives.Collection
        items={columns}
        dependencies={dependencies}
      >
        {children}
      </CollectionPrimitives.Collection>
    </TablePrimitives.Row>
  )
}

interface TableCellProps extends React.ComponentProps<
  typeof TablePrimitives.Cell
> {}

const TableCell = ({
  className,
  children,
  style,
  ...props
}: TableCellProps) => {
  const { cell, expandButton, expandIcon } = tableVariants()
  return (
    <TablePrimitives.Cell
      data-slot="table-cell"
      className={composeRenderProps(className, (cn) => cell({ className: cn }))}
      style={composeRenderProps(
        style,
        (style, { hasChildItems, isTreeColumn, level }) => ({
          ...style,
          paddingInlineStart: isTreeColumn
            ? 8 + (hasChildItems ? 0 : 20) + (level - 1) * 16
            : style?.paddingInlineStart,
        }),
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { hasChildItems, isDisabled, isExpanded, isTreeColumn }) => (
          <>
            {hasChildItems && isTreeColumn && (
              <ButtonPrimitives.Button
                slot="chevron"
                className={expandButton({
                  className: isDisabled ? 'opacity-50' : undefined,
                })}
              >
                <ChevronRightIcon
                  aria-hidden
                  className={cn(expandIcon(), isExpanded && 'rotate-90')}
                />
              </ButtonPrimitives.Button>
            )}
            {children}
          </>
        ),
      )}
    </TablePrimitives.Cell>
  )
}

interface TableDropIndicatorProps
  extends DragAndDropPrimitives.DropIndicatorProps {}

const TableDropIndicator = ({
  children,
  className,
  ...props
}: TableDropIndicatorProps) => {
  const { dropIndicator, dropIndicatorLine } = tableVariants()

  return (
    <DragAndDropPrimitives.DropIndicator
      className={composeRenderProps(className, (cn) =>
        dropIndicator({ className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isDropTarget }) => (
        <>
          <span
            aria-hidden
            className={dropIndicatorLine({
              className: isDropTarget ? 'opacity-100' : undefined,
            })}
          />
          {children}
        </>
      ))}
    </DragAndDropPrimitives.DropIndicator>
  )
}

interface TableLoadMoreProps extends React.ComponentProps<
  typeof TablePrimitives.TableLoadMoreItem
> {}

const TableLoadMore = ({ className, ...props }: TableLoadMoreProps) => {
  const { loadMore } = tableVariants()
  return (
    <TablePrimitives.TableLoadMoreItem
      className={loadMore({ className })}
      {...props}
    >
      <Loader aria-label="Loading more..." />
    </TablePrimitives.TableLoadMoreItem>
  )
}

export type {
  TableBodyProps,
  TableCellProps,
  TableColumnProps,
  TableContainerProps,
  TableDropIndicatorProps,
  TableFooterProps,
  TableHeaderProps,
  TableVirtualizerProps,
  TableLoadMoreProps,
  TableProps,
  TableRowProps,
}
export {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableDropIndicator,
  TableFooter,
  TableHeader,
  TableLayout,
  TableLoadMore,
  TableRow,
  TableVirtualizer,
}
