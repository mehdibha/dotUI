"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type {
  TableBodyProps,
  TableCellProps,
  TableColumnProps,
  TableHeaderProps,
  TableLoadMoreProps,
  TableProps,
  TableRowProps,
} from "./basic";
import {
  Table as _Table,
  TableBody as _TableBody,
  TableCell as _TableCell,
  TableColumn as _TableColumn,
  TableHeader as _TableHeader,
  TableLoadMore as _TableLoadMore,
  TableRow as _TableRow,
} from "./basic";

export const Table = createDynamicComponent<TableProps>(
  "table",
  "Table",
  _Table,
  {},
);

export const TableHeader = <T extends object = object>(
  props: TableHeaderProps<T>,
) => {
  const Component = createDynamicComponent<TableHeaderProps<T>>(
    "table",
    "TableHeader",
    _TableHeader,
    {},
  );

  return <Component {...props} />;
};

export const TableColumn = createDynamicComponent<TableColumnProps>(
  "table",
  "TableColumn",
  _TableColumn,
  {},
);

export const TableBody = <T extends object = object>(
  props: TableBodyProps<T>,
) => {
  const Component = createDynamicComponent<TableBodyProps<T>>(
    "table",
    "TableBody",
    _TableBody,
    {},
  );

  return <Component {...props} />;
};

export const TableRow = <T extends object = object>(
  props: TableRowProps<T>,
) => {
  const Component = createDynamicComponent<TableRowProps<T>>(
    "table",
    "TableRow",
    _TableRow,
    {},
  );

  return <Component {...props} />;
};

export const TableCell = createDynamicComponent<TableCellProps>(
  "table",
  "TableCell",
  _TableCell,
  {},
);

export const TableLoadMore = createDynamicComponent<TableLoadMoreProps>(
  "table",
  "TableLoadMore",
  _TableLoadMore,
  {},
);

export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableColumnProps,
  TableRowProps,
  TableCellProps,
  TableLoadMoreProps,
};
