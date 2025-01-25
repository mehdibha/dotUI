"use client";

import { ArrowUpDownIcon } from "lucide-react";
import {
  ResizableTableContainer,
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
  type RowProps as AriaRowProps,
  type TableBodyProps as AriaTableBodyProps,
  type TableHeaderProps as AriaTableHeaderProps,
} from "react-aria-components";
import { tv, VariantProps } from "tailwind-variants";
import { Checkbox } from "@/registry/core/checkbox_basic";
import { createScopedContext } from "@/registry/lib/context-helpers";
import { focusRing } from "@/registry/lib/focus-styles";

const tableStyles = tv({
  slots: {
    root: "relative w-full border-separate border-spacing-0 text-sm",
    header: "sticky top-0 z-10",
    column: [focusRing(), "px-3 py-2 text-left font-medium"],
    resizer:
      "resizing:bg-bg-accent resizing:w-[2px] h-5 w-px cursor-col-resize rounded-full",
    body: "text-fg-muted",
    row: [focusRing(), " relative select-none"],
    cell: [focusRing(), "px-3 py-2"],
  },
  variants: {
    variant: {
      bordered: {
        root: "rounded-md border",
        column: "border-b",
        row: "group/row",
        cell: "border-b group-last/row:border-b-0",
      },
      solid: {
        root: "bg-bg-inverse/5 rounded-lg p-2",
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

      },
      accent: "",
    },
  },
});

const { root, header, column, resizer, body, row, cell } = tableStyles();

const [TableProvider, useTableContext] = createScopedContext<
  VariantProps<typeof tableStyles> & {
    allowsResizing?: boolean;
  }
>("TableRoot");

interface TableRootProps
  extends React.ComponentProps<typeof AriaTable>,
    VariantProps<typeof tableStyles> {
  allowsResizing?: boolean;
}
const TableRoot = ({
  variant = "bordered",
  selectionVariant = "accent",
  allowsResizing,
  ...props
}: TableRootProps) => {
  if (allowsResizing) {
    return (
      <TableProvider
        allowsResizing
        variant={variant}
        selectionVariant={selectionVariant}
      >
        <ResizableTableContainer className="overflow-auto">
          <AriaTable className={root({ variant })} {...props} />
        </ResizableTableContainer>
      </TableProvider>
    );
  }
  return (
    <TableProvider allowsResizing={false} variant={variant}>
      <AriaTable className={root({ variant })} {...props} />
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
      {allowsDragging && <AriaColumn />}
      {selectionBehavior === "toggle" && (
        <AriaColumn>
          {selectionMode === "multiple" && (
            <Checkbox slot="selection" variant={selectionVariant} />
          )}
        </AriaColumn>
      )}
      <AriaCollection items={columns}>{children}</AriaCollection>
    </AriaTableHeader>
  );
};

interface TableColumnProps extends React.ComponentProps<typeof AriaColumn> {}
function TableColumn({ children, className, ...props }: TableColumnProps) {
  const { allowsResizing } = useTableContext("TableColumn");
  const { variant } = useTableContext("TableColumn");
  return (
    <AriaColumn
      className={composeRenderProps(className, (className) =>
        column({ variant, className })
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { allowsSorting }) => (
        <div className="flex items-center gap-2">
          <span className="flex-1">{children}</span>
          {allowsSorting && <ArrowUpDownIcon aria-hidden className="size-5" />}
          {allowsResizing && !props.width && (
            <AriaColumnResizer className={resizer()} />
          )}
        </div>
      ))}
    </AriaColumn>
  );
}
interface TableBodyProps<T extends object> extends AriaTableBodyProps<T> {
  ref?: React.RefObject<HTMLTableSectionElement>;
}
const TableBody = <T extends object>({
  className,
  ...props
}: TableBodyProps<T>) => {
  const { variant } = useTableContext("TableBody");
  return (
    <AriaTableBody
      className={composeRenderProps(className, (className) =>
        body({ variant, className })
      )}
      {...props}
    />
  );
};

interface TableRowProps<T extends object> extends AriaRowProps<T> {}
function TableRow<T extends object>({
  id,
  columns,
  children,
  ...otherProps
}: TableRowProps<T>) {
  const { selectionBehavior, allowsDragging } = useTableOptions();
  const { variant } = useTableContext("TableRow");

  return (
    <AriaRow id={id} {...otherProps} className={row({ variant })}>
      {allowsDragging && (
        <TableCell>
          <AriaButton slot="drag">≡</AriaButton>
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

interface TableCellProps extends React.ComponentProps<typeof AriaCell> {}
const TableCell = (props: TableCellProps) => {
  const { variant } = useTableContext("TableCell");
  return <AriaCell {...props} className={cell({ variant })} />;
};

export type {
  TableRootProps,
  TableHeaderProps,
  TableBodyProps,
  TableColumnProps,
  TableRowProps,
  TableCellProps,
};
export { TableRoot, TableHeader, TableBody, TableColumn, TableRow, TableCell };
