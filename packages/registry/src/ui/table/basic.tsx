"use client";

import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from "lucide-react";
import {
  Button as AriaButton,
  Cell as AriaCell,
  Collection as AriaCollection,
  Column as AriaColumn,
  ColumnResizer as AriaColumnResizer,
  ResizableTableContainer as AriaResizableTableContainer,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  TableLoadMoreItem as AriaTableLoadMoreItem,
  composeRenderProps,
  useTableOptions,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  RowProps as AriaRowProps,
  TableBodyProps as AriaTableBodyProps,
  TableHeaderProps as AriaTableHeaderProps,
} from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";
import { Checkbox } from "@dotui/registry/ui/checkbox";
import { Loader } from "@dotui/registry/ui/loader";

const tableStyles = tv({
  slots: {
    container: "relative scroll-pt-[2.321rem] overflow-auto rounded-lg border",
    table: "w-full text-sm",
    header: "sticky top-0 z-10 bg-bg",
    column: "h-10 whitespace-nowrap px-2 text-left align-middle font-medium",
    resizer: "",
    body: "",
    row: "",
    cell: "whitespace-nowrap p-2 align-middle",
    loadMore: [
      "**:data-[slot=loader]:-translate-x-1/2 relative h-7 **:data-[slot=loader]:absolute **:data-[slot=loader]:top-0 **:data-[slot=loader]:left-1/2",
      "[&_[data-slot=loader]_svg]:size-4",
    ],
  },
});

const { container, table, header, column, resizer, body, row, cell, loadMore } =
  tableStyles();

/* -----------------------------------------------------------------------------------------------*/

interface TableContainerProps
  extends React.ComponentProps<typeof AriaResizableTableContainer> {
  resizable?: boolean;
}

const TableContainer = ({
  resizable,
  className,
  ...props
}: TableContainerProps) => {
  if (resizable) {
    return (
      <AriaResizableTableContainer
        className={container({ className })}
        {...props}
      />
    );
  }
  return <div className={container({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface TableProps extends React.ComponentProps<typeof AriaTable> {
  resizable?: boolean;
}

const Table = ({ className, resizable, ...props }: TableProps) => {
  return (
    <TableContainer resizable={resizable}>
      <AriaTable
        className={composeRenderProps(className, (cn) =>
          table({ className: cn }),
        )}
        {...props}
      />
    </TableContainer>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TableHeaderProps<T extends object> extends AriaTableHeaderProps<T> {}

const TableHeader = <T extends object>({
  className,
  columns,
  children,
  ...props
}: TableHeaderProps<T>) => {
  const { selectionBehavior, selectionMode, allowsDragging } =
    useTableOptions();
  return (
    <AriaTableHeader
      data-slot="table-header"
      className={composeRenderProps(className, (cn) =>
        header({ className: cn }),
      )}
      {...props}
    >
      {allowsDragging && <TableColumn />}
      {selectionBehavior === "toggle" && (
        <TableColumn>
          {selectionMode === "multiple" && <Checkbox slot="selection" />}
        </TableColumn>
      )}
      <AriaCollection items={columns}>{children}</AriaCollection>
    </AriaTableHeader>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TableColumnProps extends React.ComponentProps<typeof AriaColumn> {
  allowsResizing?: boolean;
}

const TableColumn = ({
  allowsResizing,
  children,
  className,
  ...props
}: TableColumnProps) => {
  return (
    <AriaColumn
      data-slot="table-column"
      className={composeRenderProps(className, (cn) =>
        column({ className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { allowsSorting, sortDirection }) => (
          <div className="flex items-center">
            <span className="flex-1 truncate">{children}</span>
            {allowsSorting &&
              (sortDirection === "ascending" ? (
                <ChevronUpIcon aria-hidden className="size-3 text-fg-muted" />
              ) : (
                <ChevronDownIcon aria-hidden className="size-3 text-fg-muted" />
              ))}
            {!props.width && allowsResizing && (
              <AriaColumnResizer className={resizer()} />
            )}
          </div>
        ),
      )}
    </AriaColumn>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TableBodyProps<T extends object> extends AriaTableBodyProps<T> {
  isLoading?: boolean;
  onLoadMore?: () => void;
}

const TableBody = <T extends object>({
  renderEmptyState = () => "No results found.",
  children,
  className,
  items,
  isLoading,
  onLoadMore,
  ...props
}: TableBodyProps<T>) => {
  return (
    <AriaTableBody
      renderEmptyState={renderEmptyState}
      className={composeRenderProps(className, (className) =>
        body({ className }),
      )}
      {...props}
    >
      <AriaCollection items={items}>{children}</AriaCollection>
      <TableLoadMore isLoading={isLoading} onLoadMore={onLoadMore} />
    </AriaTableBody>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TableRowProps<T extends object> extends AriaRowProps<T> {}

function TableRow<T extends object>({
  columns,
  children,
  className,
  ...props
}: TableRowProps<T>) {
  const { selectionBehavior, allowsDragging } = useTableOptions();

  return (
    <AriaRow
      className={composeRenderProps(className, (cn) => row({ className: cn }))}
      {...props}
    >
      {allowsDragging && (
        <TableCell className="cursor-grab">
          <AriaButton
            slot="drag"
            className={cn(
              "focus-reset focus-visible:focus-ring",
              "inline-flex items-center justify-center rounded-xs text-fg-muted [&_svg]:size-4",
            )}
          >
            <GripVerticalIcon />
          </AriaButton>
        </TableCell>
      )}
      {selectionBehavior === "toggle" && (
        <TableCell>
          <Checkbox slot="selection" />
        </TableCell>
      )}
      <AriaCollection items={columns}>{children}</AriaCollection>
    </AriaRow>
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface TableCellProps extends React.ComponentProps<typeof AriaCell> {}

const TableCell = ({ className, ...props }: TableCellProps) => {
  return (
    <AriaCell
      data-slot="table-cell"
      className={composeRenderProps(className, (cn) => cell({ className: cn }))}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TableLoadMoreProps
  extends React.ComponentProps<typeof AriaTableLoadMoreItem> {}

const TableLoadMore = ({ className, ...props }: TableLoadMoreProps) => {
  return (
    <AriaTableLoadMoreItem className={loadMore({ className })} {...props}>
      <Loader aria-label="Loading more..." />
    </AriaTableLoadMoreItem>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableLoadMore,
  TableRow,
  TableCell,
};

export type {
  TableProps,
  TableHeaderProps,
  TableColumnProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableLoadMoreProps,
};
