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
  {
    basic: React.lazy(() =>
      import("../registry/components/table/basic").then((mod) => ({
        default: mod.TableContainer,
      })),
    ),
  },
);

export const TableRoot = createDynamicComponent<TableRootProps>(
  "table",
  "TableRoot",
  _TableRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/table/basic").then((mod) => ({
        default: mod.TableRoot,
      })),
    ),
  },
);

export const TableHeader = createDynamicComponent<TableHeaderProps<object>>(
  "table",
  "TableHeader",
  _TableHeader,
  {
    basic: React.lazy(() =>
      import("../registry/components/table/basic").then((mod) => ({
        default: mod.TableHeader,
      })),
    ),
  },
);

export const TableBody = createDynamicComponent<TableBodyProps<object>>(
  "table",
  "TableBody",
  _TableBody,
  {
    basic: React.lazy(() =>
      import("../registry/components/table/basic").then((mod) => ({
        default: mod.TableBody,
      })),
    ),
  },
);

export const TableColumn = createDynamicComponent<TableColumnProps>(
  "table",
  "TableColumn",
  _TableColumn,
  {
    basic: React.lazy(() =>
      import("../registry/components/table/basic").then((mod) => ({
        default: mod.TableColumn,
      })),
    ),
  },
);

export const TableRow = createDynamicComponent<TableRowProps<object>>(
  "table",
  "TableRow",
  _TableRow,
  {
    basic: React.lazy(() =>
      import("../registry/components/table/basic").then((mod) => ({
        default: mod.TableRow,
      })),
    ),
  },
);

export const TableCell = createDynamicComponent<TableCellProps>(
  "table",
  "TableCell",
  _TableCell,
  {
    basic: React.lazy(() =>
      import("../registry/components/table/basic").then((mod) => ({
        default: mod.TableCell,
      })),
    ),
  },
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
