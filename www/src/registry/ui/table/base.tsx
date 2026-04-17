"use client";

import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from "lucide-react";
import * as ButtonPrimitives from "react-aria-components/Button";
import * as CollectionPrimitives from "react-aria-components/Collection";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TablePrimitives from "react-aria-components/Table";

import { cn } from "@/registry/lib/utils";
import { Checkbox } from "@/registry/ui/checkbox";
import { Loader } from "@/registry/ui/loader";

import { useStyles } from "./styles";

// MARK: tableStyles

// MARK: seperator

interface TableContainerProps extends React.ComponentProps<typeof TablePrimitives.ResizableTableContainer> {
	resizable?: boolean;
}

const TableContainer = ({ resizable, className, ...props }: TableContainerProps) => {
	const { container } = useStyles()();
	if (resizable) {
		return <TablePrimitives.ResizableTableContainer className={container({ className })} {...props} />;
	}
	return <div className={container({ className })} {...props} />;
};

// MARK: seperator

interface TableProps extends React.ComponentProps<typeof TablePrimitives.Table> {
	resizable?: boolean;
}

const Table = ({ className, resizable, ...props }: TableProps) => {
	const { table } = useStyles()();
	return (
		<TableContainer resizable={resizable}>
			<TablePrimitives.Table className={composeRenderProps(className, (cn) => table({ className: cn }))} {...props} />
		</TableContainer>
	);
};

// MARK: seperator

interface TableHeaderProps<T extends object> extends TablePrimitives.TableHeaderProps<T> {}

const TableHeader = <T extends object>({ className, columns, children, ...props }: TableHeaderProps<T>) => {
	const { header } = useStyles()();
	const { selectionBehavior, selectionMode, allowsDragging } = TablePrimitives.useTableOptions();
	return (
		<TablePrimitives.TableHeader
			data-slot="table-header"
			className={composeRenderProps(className, (cn) => header({ className: cn }))}
			{...props}
		>
			{allowsDragging && <TableColumn />}
			{selectionBehavior === "toggle" && (
				<TableColumn>{selectionMode === "multiple" && <Checkbox slot="selection" />}</TableColumn>
			)}
			<CollectionPrimitives.Collection items={columns}>{children}</CollectionPrimitives.Collection>
		</TablePrimitives.TableHeader>
	);
};

// MARK: seperator

interface TableColumnProps extends React.ComponentProps<typeof TablePrimitives.Column> {
	allowsResizing?: boolean;
}

const TableColumn = ({ allowsResizing, children, className, ...props }: TableColumnProps) => {
	const { column, resizer } = useStyles()();
	return (
		<TablePrimitives.Column
			data-slot="table-column"
			className={composeRenderProps(className, (cn) => column({ className: cn }))}
			{...props}
		>
			{composeRenderProps(children, (children, { allowsSorting, sortDirection }) => (
				<div className="flex items-center">
					<span className="flex-1 truncate">{children}</span>
					{allowsSorting &&
						(sortDirection === "ascending" ? (
							<ChevronUpIcon aria-hidden className="size-3 text-fg-muted" />
						) : (
							<ChevronDownIcon aria-hidden className="size-3 text-fg-muted" />
						))}
					{!props.width && allowsResizing && <TablePrimitives.ColumnResizer className={resizer()} />}
				</div>
			))}
		</TablePrimitives.Column>
	);
};

// MARK: seperator

interface TableBodyProps<T extends object> extends TablePrimitives.TableBodyProps<T> {
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
	const { body } = useStyles()();
	return (
		<TablePrimitives.TableBody
			renderEmptyState={renderEmptyState}
			className={composeRenderProps(className, (className) => body({ className }))}
			{...props}
		>
			<CollectionPrimitives.Collection items={items}>{children}</CollectionPrimitives.Collection>
			<TableLoadMore isLoading={isLoading} onLoadMore={onLoadMore} />
		</TablePrimitives.TableBody>
	);
};

// MARK: seperator

interface TableRowProps<T extends object> extends TablePrimitives.RowProps<T> {}

function TableRow<T extends object>({ columns, children, className, ...props }: TableRowProps<T>) {
	const { row } = useStyles()();
	const { selectionBehavior, allowsDragging } = TablePrimitives.useTableOptions();

	return (
		<TablePrimitives.Row className={composeRenderProps(className, (cn) => row({ className: cn }))} {...props}>
			{allowsDragging && (
				<TableCell className="cursor-grab">
					<ButtonPrimitives.Button
						slot="drag"
						className={cn(
							"focus-reset focus-visible:focus-ring",
							"inline-flex items-center justify-center rounded-xs text-fg-muted [&_svg]:size-4",
						)}
					>
						<GripVerticalIcon />
					</ButtonPrimitives.Button>
				</TableCell>
			)}
			{selectionBehavior === "toggle" && (
				<TableCell>
					<Checkbox slot="selection" />
				</TableCell>
			)}
			<CollectionPrimitives.Collection items={columns}>{children}</CollectionPrimitives.Collection>
		</TablePrimitives.Row>
	);
}

// MARK: seperator

interface TableCellProps extends React.ComponentProps<typeof TablePrimitives.Cell> {}

const TableCell = ({ className, ...props }: TableCellProps) => {
	const { cell } = useStyles()();
	return (
		<TablePrimitives.Cell
			data-slot="table-cell"
			className={composeRenderProps(className, (cn) => cell({ className: cn }))}
			{...props}
		/>
	);
};

// MARK: seperator

interface TableLoadMoreProps extends React.ComponentProps<typeof TablePrimitives.TableLoadMoreItem> {}

const TableLoadMore = ({ className, ...props }: TableLoadMoreProps) => {
	const { loadMore } = useStyles()();
	return (
		<TablePrimitives.TableLoadMoreItem className={loadMore({ className })} {...props}>
			<Loader aria-label="Loading more..." />
		</TablePrimitives.TableLoadMoreItem>
	);
};

// MARK: seperator

export type {
	TableBodyProps,
	TableCellProps,
	TableColumnProps,
	TableHeaderProps,
	TableLoadMoreProps,
	TableProps,
	TableRowProps,
};
export { Table, TableBody, TableCell, TableColumn, TableHeader, TableLoadMore, TableRow };
