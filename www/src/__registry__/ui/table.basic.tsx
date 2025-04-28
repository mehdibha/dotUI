"use client";

import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from "lucide-react";
import {
  ResizableTableContainer as AriaResizableTableContainer,
  Table as AriaTable,
  TableHeader as AriaTableHeader,
  TableBody as AriaTableBody,
  Column as AriaColumn,
  Collection as AriaCollection,
  ColumnResizer as AriaColumnResizer,
  Row as AriaRow,
  Cell as AriaCell,
  Button as AriaButton,
  useTableOptions,
  composeRenderProps,
  type ResizableTableContainerProps as AriaResiableTableContainerProps,
  type RowProps as AriaRowProps,
  type TableBodyProps as AriaTableBodyProps,
  type TableHeaderProps as AriaTableHeaderProps,
} from "react-aria-components";
import { tv, VariantProps } from "tailwind-variants";
import { Checkbox } from "@/components/dynamic-ui/checkbox";
import { focusRing } from "@/modules/registry/lib/focus-styles";
import { cn } from "@/modules/registry/lib/utils";
import { createScopedContext } from "@/modules/registry/lib/utils";

const tableStyles = tv({
  slots: {
    container: "w-full overflow-auto",
    root: [
      "relative table min-h-24 w-auto border-separate border-spacing-0 cursor-default text-sm",
      "[&_.react-aria-DropIndicator]:outline-bg-accent [&_.react-aria-DropIndicator]:translate-z-0 [&_.react-aria-DropIndicator]:outline",
    ],
    header: "sticky top-0 z-10",
    column: [
      focusRing(),
      "allows-sorting:cursor-pointer text-fg-muted relative whitespace-nowrap px-3 py-2 text-left font-medium",
    ],
    resizer: [
      focusRing(),
      "resizing:before:bg-bg-accent before:bg-border-field resizing:before:w-0.5 absolute right-0 box-content h-5 w-px cursor-col-resize px-2 before:block before:h-5 before:w-px before:transition-colors before:content-['']",
    ],
    body: "empty:text-center empty:italic",
    row: [
      focusRing(),
      "data-href:cursor-pointer data-href:hover:bg-bg-muted data-action:cursor-pointer data-action:hover:bg-bg-muted disabled:text-fg-disabled data-[selection-mode=single]:hover:not-selected:bg-bg-muted data-[selection-mode=multiple]:hover:not-selected:bg-bg-muted selected:text-fg dragging:bg-bg relative transition-colors data-[selection-mode=multiple]:cursor-pointer data-[selection-mode=single]:cursor-pointer",
    ],
    cell: [focusRing(), "truncate px-3 py-2"],
  },
  variants: {
    variant: {
      bordered: {
        container: "rounded-md border",
        column: "border-b",
        row: "group/row",
        cell: "border-b group-last/row:border-b-0",
      },
      solid: {
        container: "bg-bg-inverse/5 rounded-lg p-2",
        header: "text-fg-muted border-y",
        body: "text-fg",
        column: "bg-bg-inverse/5 first:rounded-l-sm last:rounded-r-sm",
      },
      line: {
        column: "border-b",
        row: "group/row",
        cell: "border-b group-last/row:border-b-0",
      },
      quiet: {},
    },
    selectionVariant: {
      primary: {
        row: "selected:bg-bg-primary-muted",
      },
      accent: {
        row: "selected:bg-bg-accent-muted",
      },
    },
  },
  defaultVariants: {
    variant: "line",
    selectionVariant: "accent",
  },
});

const { container, root, header, column, resizer, body, row, cell } =
  tableStyles();

const [TableProvider, useTableContext] = createScopedContext<
  VariantProps<typeof tableStyles> & {
    globalAction?: boolean;
  }
>("TableRoot");

interface TableRootProps
  extends Omit<React.ComponentProps<typeof AriaTable>, "className" | "style">,
    Pick<AriaResiableTableContainerProps, "className" | "style">,
    VariantProps<typeof tableStyles> {}
const TableRoot = ({
  className,
  style,
  variant,
  selectionVariant,
  onRowAction,
  ...props
}: TableRootProps) => {
  return (
    <TableProvider
      variant={variant}
      selectionVariant={selectionVariant}
      globalAction={!!onRowAction}
    >
      <TableContainer variant={variant} className={className} style={style}>
        {/* TODO: FIX THIS SHIT */}
        <AriaTable
          className={root({ variant })}
          onRowAction={onRowAction}
          {...props}
        />
      </TableContainer>
    </TableProvider>
  );
};

interface TableHeaderProps<T extends object> extends AriaTableHeaderProps<T> {}
const TableHeader = <T extends object>({
  columns,
  children,
  ...props
}: TableHeaderProps<T>) => {
  const { variant, selectionVariant } = useTableContext("TableHeader");
  const { selectionBehavior, selectionMode, allowsDragging } =
    useTableOptions();
  return (
    <AriaTableHeader className={header({ variant })} {...props}>
      {allowsDragging && <TableColumn />}
      {selectionBehavior === "toggle" && (
        <TableColumn>
          {selectionMode === "multiple" && (
            <Checkbox slot="selection" variant={selectionVariant} />
          )}
        </TableColumn>
      )}
      <AriaCollection items={columns}>{children}</AriaCollection>
    </AriaTableHeader>
  );
};

interface TableColumnProps extends React.ComponentProps<typeof AriaColumn> {
  allowsResizing?: boolean;
}
function TableColumn({
  allowsResizing,
  children,
  className,
  ...props
}: TableColumnProps) {
  const { variant } = useTableContext("TableColumn");
  return (
    <AriaColumn
      className={composeRenderProps(className, (className) =>
        column({ variant, className })
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { allowsSorting, sortDirection }) => (
          <div className="flex items-center gap-2">
            <span className="flex-1 truncate">{children}</span>
            {allowsSorting &&
              (sortDirection === "ascending" ? (
                <ChevronUpIcon aria-hidden className="text-fg-muted size-3" />
              ) : (
                <ChevronDownIcon aria-hidden className="text-fg-muted size-3" />
              ))}
            {allowsResizing && !props.width && (
              <AriaColumnResizer className={resizer()} />
            )}
          </div>
        )
      )}
    </AriaColumn>
  );
}
interface TableBodyProps<T extends object> extends AriaTableBodyProps<T> {
  ref?: React.RefObject<HTMLTableSectionElement>;
}
const TableBody = <T extends object>({
  renderEmptyState = () => "No results found.",
  className,
  ...props
}: TableBodyProps<T>) => {
  const { variant } = useTableContext("TableBody");
  return (
    <AriaTableBody
      renderEmptyState={renderEmptyState}
      className={composeRenderProps(className, (className) =>
        body({ variant, className })
      )}
      {...props}
    />
  );
};

interface TableRowProps<T extends object> extends AriaRowProps<T> {}
function TableRow<T extends object>({
  columns,
  children,
  onAction,
  ...props
}: TableRowProps<T>) {
  const { selectionBehavior, allowsDragging } = useTableOptions();
  const { variant, selectionVariant, globalAction } =
    useTableContext("TableRow");

  return (
    <AriaRow
      data-action={globalAction || !!onAction || undefined}
      className={row({ variant, selectionVariant })}
      onAction={onAction}
      {...props}
    >
      {allowsDragging && (
        <TableCell className="cursor-grab">
          <AriaButton
            slot="drag"
            className={cn(
              focusRing(),
              "rounded-xs text-fg-muted inline-flex items-center justify-center [&_svg]:size-4"
            )}
          >
            <GripVerticalIcon />
          </AriaButton>
        </TableCell>
      )}
      {selectionBehavior === "toggle" && (
        <TableCell>
          <Checkbox slot="selection" variant={selectionVariant} />
        </TableCell>
      )}
      <AriaCollection items={columns}>{children}</AriaCollection>
    </AriaRow>
  );
}

interface TableCellProps extends React.ComponentProps<typeof AriaCell> {}
const TableCell = ({ className, ...props }: TableCellProps) => {
  const { variant } = useTableContext("TableCell");
  return (
    <AriaCell
      className={composeRenderProps(className, (className) =>
        cell({ variant, className })
      )}
      {...props}
    />
  );
};

interface TableContainerProps
  extends React.ComponentProps<typeof AriaResizableTableContainer>,
    VariantProps<typeof tableStyles> {
  resizable?: boolean;
}
const TableContainer = ({
  ref,
  resizable = false,
  variant,
  children,
  className,
  style,
  ...props
}: TableContainerProps) => {
  if (resizable)
    return (
      <AriaResizableTableContainer
        className={container({ variant, className })}
        {...props}
      >
        {children}
      </AriaResizableTableContainer>
    );
  return (
    <div ref={ref} className={container({ variant, className })} style={style}>
      {children}
    </div>
  );
};

export type {
  TableContainerProps,
  TableRootProps,
  TableHeaderProps,
  TableBodyProps,
  TableColumnProps,
  TableRowProps,
  TableCellProps,
};
export {
  TableContainer,
  TableRoot,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
};
