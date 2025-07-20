"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  TableBody as _TableBody,
  TableCell as _TableCell,
  TableColumn as _TableColumn,
  TableContainer as _TableContainer,
  TableHeader as _TableHeader,
  TableRoot as _TableRoot,
  TableRow as _TableRow,
} from "../registry/components/table/basic";
import type {
  TableBodyProps,
  TableCellProps,
  TableColumnProps,
  TableContainerProps,
  TableHeaderProps,
  TableRootProps,
  TableRowProps,
} from "../registry/components/table/basic";

export const TableContainer = createDynamicComponent<TableContainerProps>(
  "table",
  "TableContainer",
  _TableContainer,
  {},
);

export const TableRoot = createDynamicComponent<TableRootProps>(
  "table",
  "TableRoot",
  _TableRoot,
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

export const TableColumn = createDynamicComponent<TableColumnProps>(
  "table",
  "TableColumn",
  _TableColumn,
  {},
);

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

export type {
  TableContainerProps,
  TableRootProps,
  TableHeaderProps,
  TableBodyProps,
  TableColumnProps,
  TableRowProps,
  TableCellProps,
};
