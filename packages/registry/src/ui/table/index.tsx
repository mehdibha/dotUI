"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type {
	TableBodyProps,
	TableCellProps,
	TableColumnProps,
	TableHeaderProps,
	TableLoadMoreProps,
	TableProps,
	TableRowProps,
} from "./types";

export const Table = createDynamicComponent<TableProps>("table", "Table", Default.Table, {});

export const TableHeader = <T extends object = object>(props: TableHeaderProps<T>) => {
	const Component = createDynamicComponent<TableHeaderProps<T>>("table", "TableHeader", Default.TableHeader, {});

	return <Component {...props} />;
};

export const TableColumn = createDynamicComponent<TableColumnProps>("table", "TableColumn", Default.TableColumn, {});

export const TableBody = <T extends object = object>(props: TableBodyProps<T>) => {
	const Component = createDynamicComponent<TableBodyProps<T>>("table", "TableBody", Default.TableBody, {});

	return <Component {...props} />;
};

export const TableRow = <T extends object = object>(props: TableRowProps<T>) => {
	const Component = createDynamicComponent<TableRowProps<T>>("table", "TableRow", Default.TableRow, {});

	return <Component {...props} />;
};

export const TableCell = createDynamicComponent<TableCellProps>("table", "TableCell", Default.TableCell, {});

export const TableLoadMore = createDynamicComponent<TableLoadMoreProps>(
	"table",
	"TableLoadMore",
	Default.TableLoadMore,
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
