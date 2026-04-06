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
import type {
	RowProps as AriaRowProps,
	TableBodyProps as AriaTableBodyProps,
	TableHeaderProps as AriaTableHeaderProps,
} from "react-aria-components";

import { cn } from "@/registry/lib/utils";
import { Checkbox } from "@/registry/ui/checkbox";
import { Loader } from "@/registry/ui/loader";

import { useStyles } from "./styles";

// MARK: tableStyles

// MARK: seperator

interface TableContainerProps extends React.ComponentProps<typeof AriaResizableTableContainer> {
	resizable?: boolean;
}

const TableContainer = ({ resizable, className, ...props }: TableContainerProps) => {
	const { container } = useStyles()();
	if (resizable) {
		return <AriaResizableTableContainer className={container({ className })} {...props} />;
	}
	return <div className={container({ className })} {...props} />;
};

// MARK: seperator

interface TableProps extends React.ComponentProps<typeof AriaTable> {
	resizable?: boolean;
}

const Table = ({ className, resizable, ...props }: TableProps) => {
	const { table } = useStyles()();
	return (
		<TableContainer resizable={resizable}>
			<AriaTable className={composeRenderProps(className, (cn) => table({ className: cn }))} {...props} />
		</TableContainer>
	);
};

// MARK: seperator

interface TableHeaderProps<T extends object> extends AriaTableHeaderProps<T> {}

const TableHeader = <T extends object>({ className, columns, children, ...props }: TableHeaderProps<T>) => {
	const { header } = useStyles()();
	const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();
	return (
		<AriaTableHeader
			data-slot="table-header"
			className={composeRenderProps(className, (cn) => header({ className: cn }))}
			{...props}
		>
			{allowsDragging && <TableColumn />}
			{selectionBehavior === "toggle" && (
				<TableColumn>{selectionMode === "multiple" && <Checkbox slot="selection" />}</TableColumn>
			)}
			<AriaCollection items={columns}>{children}</AriaCollection>
		</AriaTableHeader>
	);
};

// MARK: seperator

interface TableColumnProps extends React.ComponentProps<typeof AriaColumn> {
	allowsResizing?: boolean;
}

const TableColumn = ({ allowsResizing, children, className, ...props }: TableColumnProps) => {
	const { column, resizer } = useStyles()();
	return (
		<AriaColumn
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
					{!props.width && allowsResizing && <AriaColumnResizer className={resizer()} />}
				</div>
			))}
		</AriaColumn>
	);
};

// MARK: seperator

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
	const { body } = useStyles()();
	return (
		<AriaTableBody
			renderEmptyState={renderEmptyState}
			className={composeRenderProps(className, (className) => body({ className }))}
			{...props}
		>
			<AriaCollection items={items}>{children}</AriaCollection>
			<TableLoadMore isLoading={isLoading} onLoadMore={onLoadMore} />
		</AriaTableBody>
	);
};

// MARK: seperator

interface TableRowProps<T extends object> extends AriaRowProps<T> {}

function TableRow<T extends object>({ columns, children, className, ...props }: TableRowProps<T>) {
	const { row } = useStyles()();
	const { selectionBehavior, allowsDragging } = useTableOptions();

	return (
		<AriaRow className={composeRenderProps(className, (cn) => row({ className: cn }))} {...props}>
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

// MARK: seperator

interface TableCellProps extends React.ComponentProps<typeof AriaCell> {}

const TableCell = ({ className, ...props }: TableCellProps) => {
	const { cell } = useStyles()();
	return (
		<AriaCell
			data-slot="table-cell"
			className={composeRenderProps(className, (cn) => cell({ className: cn }))}
			{...props}
		/>
	);
};

// MARK: seperator

interface TableLoadMoreProps extends React.ComponentProps<typeof AriaTableLoadMoreItem> {}

const TableLoadMore = ({ className, ...props }: TableLoadMoreProps) => {
	const { loadMore } = useStyles()();
	return (
		<AriaTableLoadMoreItem className={loadMore({ className })} {...props}>
			<Loader aria-label="Loading more..." />
		</AriaTableLoadMoreItem>
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
