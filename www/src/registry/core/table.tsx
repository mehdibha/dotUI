"use client";

import React from "react";
// import { IconChevronLgDown, IconHamburger } from "lucide-react";
import { MenuIcon, ChevronDownIcon } from "lucide-react";
import type {
  CellProps,
  ColumnProps,
  ColumnResizerProps,
  TableHeaderProps as HeaderProps,
  RowProps,
  TableBodyProps,
  TableProps as TablePrimitiveProps,
} from "react-aria-components";
import {
  Button,
  Cell,
  Collection,
  Column,
  ColumnResizer as ColumnResizerPrimitive,
  ResizableTableContainer,
  Row,
  TableBody,
  TableHeader,
  Table as TablePrimitive,
  composeRenderProps,
  useTableOptions,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Checkbox } from "@/registry/core/checkbox_basic";
import { cn } from "@/registry/lib/cn";

const table = tv({
  slots: {
    root: "outline-hidden **:drop-target:border **:drop-target:border-primary table w-full min-w-full caption-bottom border-spacing-0 rounded-md border text-sm",
    header: "x32 border-b",
    row: "tr bg-bg text-fg/70 outline-hidden ring-primary group relative cursor-default border-b focus:ring-0 focus-visible:ring-1",
    cellIcon:
      "bg-bg-muted text-fg grid size-[1.15rem] flex-none shrink-0 place-content-center rounded *:data-[slot=icon]:size-3.5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:transition-transform *:data-[slot=icon]:duration-200",
    columnResizer: [
      "[&[data-resizing]>div]:bg-primary absolute bottom-0 right-0 top-0 grid w-px touch-none place-content-center px-1",
      "&[data-resizable-direction=left]:cursor-e-resize &[data-resizable-direction=right]:cursor-w-resize data-[resizable-direction=both]:cursor-ew-resize",
    ],
  },
});

const { root, header, row, cellIcon, columnResizer } = table();

interface TableProps extends TablePrimitiveProps {
  className?: string;
  allowResize?: boolean;
}

const TableContext = React.createContext<TableProps>({
  allowResize: false,
});

const useTableContext = () => React.useContext(TableContext);

const Table = ({ children, className, ...props }: TableProps) => (
  <TableContext.Provider value={props}>
    <div className="relative w-full overflow-auto">
      {props.allowResize ? (
        <ResizableTableContainer className="overflow-auto">
          <TablePrimitive {...props} className={root({ className })}>
            {children}
          </TablePrimitive>
        </ResizableTableContainer>
      ) : (
        <TablePrimitive {...props} className={root({ className })}>
          {children}
        </TablePrimitive>
      )}
    </div>
  </TableContext.Provider>
);

const ColumnResizer = ({ className, ...props }: ColumnResizerProps) => (
  <ColumnResizerPrimitive
    {...props}
    className={composeRenderProps(className, (className, renderProps) =>
      columnResizer({
        ...renderProps,
        className,
      })
    )}
  >
    <div className="bg-border h-full w-px py-3" />
  </ColumnResizerPrimitive>
);

const Body = <T extends object>(props: TableBodyProps<T>) => (
  <TableBody
    data-slot="table-body"
    {...props}
    className={cn("[&_.tr:last-child]:border-0")}
  />
);

interface TableCellProps extends CellProps {
  className?: string;
}

const cellStyles = tv({
  base: "outline-hidden group whitespace-nowrap px-3 py-3",
  variants: {
    allowResize: {
      true: "overflow-hidden truncate",
    },
  },
});
const TableCell = ({ children, className, ...props }: TableCellProps) => {
  const { allowResize } = useTableContext();
  return (
    <Cell
      data-slot="table-cell"
      {...props}
      className={cellStyles({ allowResize, className })}
    >
      {children}
    </Cell>
  );
};

const columnStyles = tv({
  base: "allows-sorting:cursor-pointer outline-hidden data-dragging:cursor-grabbing relative whitespace-nowrap px-3 py-3 text-left font-medium [&:has([slot=selection])]:pr-0",
  variants: {
    isResizable: {
      true: "overflow-hidden truncate",
    },
  },
});

interface TableColumnProps extends ColumnProps {
  className?: string;
  isResizable?: boolean;
}

const TableColumn = ({
  isResizable = false,
  className,
  ...props
}: TableColumnProps) => {
  return (
    <Column
      data-slot="table-column"
      {...props}
      className={columnStyles({
        isResizable,
        className,
      })}
    >
      {({ allowsSorting, sortDirection, isHovered }) => (
        <div className="**:data-[slot=icon]:shrink-0 flex items-center gap-2">
          <>
            {props.children as React.ReactNode}
            {allowsSorting && (
              <span
                className={cellIcon({
                  className: isHovered ? "bg-secondary-fg/10" : "",
                })}
              >
                <ChevronDownIcon
                  className={sortDirection === "ascending" ? "rotate-180" : ""}
                />
              </span>
            )}
            {isResizable && <ColumnResizer />}
          </>
        </div>
      )}
    </Column>
  );
};

interface TableHeaderProps<T extends object> extends HeaderProps<T> {
  className?: string;
  ref?: React.Ref<HTMLTableSectionElement>;
}

const Header = <T extends object>({
  children,
  ref,
  className,
  columns,
  ...props
}: TableHeaderProps<T>) => {
  const { selectionBehavior, selectionMode, allowsDragging } =
    useTableOptions();
  return (
    <TableHeader
      data-slot="table-header"
      ref={ref}
      className={header({ className })}
      {...props}
    >
      {allowsDragging && <Column className="w-0" />}
      {selectionBehavior === "toggle" && (
        <Column className="w-0 pl-4">
          {selectionMode === "multiple" && <Checkbox slot="selection" />}
        </Column>
      )}
      <Collection items={columns}>{children}</Collection>
    </TableHeader>
  );
};

interface TableRowProps<T extends object> extends RowProps<T> {
  className?: string;
  ref?: React.Ref<HTMLTableRowElement>;
}

const TableRow = <T extends object>({
  children,
  className,
  columns,
  id,
  ref,
  ...props
}: TableRowProps<T>) => {
  const { selectionBehavior, allowsDragging } = useTableOptions();
  return (
    <Row
      ref={ref}
      data-slot="table-row"
      id={id}
      {...props}
      className={row({
        className:
          "href" in props
            ? cn(
                "data-hovered:bg-secondary/50 data-hovered:text-secondary-fg cursor-pointer",
                className
              )
            : "",
      })}
    >
      {allowsDragging && (
        <Cell className="ring-primary data-dragging:cursor-grabbing group cursor-grab pr-0">
          <Button
            className="text-muted-fg data-pressed:text-fg relative bg-transparent py-1.5 pl-3.5"
            slot="drag"
          >
            <MenuIcon />
          </Button>
        </Cell>
      )}
      {selectionBehavior === "toggle" && (
        <Cell className="pl-4">
          <span
            aria-hidden
            className="bg-primary group-data-selected:block absolute inset-y-0 left-0 hidden h-full w-0.5"
          />
          <Checkbox slot="selection" />
        </Cell>
      )}
      <Collection items={columns}>{children}</Collection>
    </Row>
  );
};

export type {
  TableProps,
  TableBodyProps,
  TableCellProps,
  TableColumnProps,
  TableRowProps,
};
export {
  Table,
  Body as TableBody,
  Header as TableHeader,
  TableCell,
  TableColumn,
  TableRow,
};
