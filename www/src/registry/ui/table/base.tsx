"use client";

import * as React from "react";

import { ArrowUpIcon, ChevronRightIcon, GripVerticalIcon } from "lucide-react";
import * as ButtonPrimitives from "react-aria-components/Button";
import * as CollectionPrimitives from "react-aria-components/Collection";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TablePrimitives from "react-aria-components/Table";
import * as DragAndDropPrimitives from "react-aria-components/useDragAndDrop";
import * as VirtualizerPrimitives from "react-aria-components/Virtualizer";

import type { GridNode } from "react-stately/private/grid/GridCollection";
import type { LayoutNode } from "react-stately/useVirtualizerState";

import { cn } from "@/registry/lib/utils";
import { Checkbox } from "@/registry/ui/checkbox";
import { Loader } from "@/registry/ui/loader";

import { useStyles } from "./styles";

// MARK: tableStyles

class TableLayout<T> extends VirtualizerPrimitives.TableLayout<T> {
	protected override buildRow(node: GridNode<T>, x: number, y: number): LayoutNode {
		const layoutNode = super.buildRow(node, x, y);
		layoutNode.layoutInfo.allowOverflow = true;
		return layoutNode;
	}

	protected override buildColumn(node: GridNode<T>, x: number, y: number): LayoutNode {
		const layoutNode = super.buildColumn(node, x, y);
		layoutNode.layoutInfo.allowOverflow = true;
		return layoutNode;
	}
}

// MARK: Separator

interface TableVirtualizerProps<T extends object> extends Omit<VirtualizerPrimitives.VirtualizerProps<T>, "layout"> {
	rowHeight?: number;
	headingHeight?: number;
}

const TABLE_VIRTUALIZER_HEIGHTS = {
	compact: 32,
	default: 40,
	comfortable: 48,
} as const;

const TableVirtualizer = <T extends object>({
	headingHeight,
	layoutOptions,
	rowHeight,
	...props
}: TableVirtualizerProps<T>) => {
	const densityHeight = TABLE_VIRTUALIZER_HEIGHTS.default;
	const tableLayoutOptions = layoutOptions as { rowHeight?: number; headingHeight?: number } | undefined;

	return (
		<VirtualizerPrimitives.Virtualizer
			layout={TableLayout}
			layoutOptions={{
				...layoutOptions,
				rowHeight: rowHeight ?? tableLayoutOptions?.rowHeight ?? densityHeight,
				headingHeight: headingHeight ?? tableLayoutOptions?.headingHeight ?? densityHeight,
			}}
			{...props}
		/>
	);
};

// MARK: Separator

const TableContainerContext = React.createContext({ resizable: false });

// MARK: Separator

interface TableContainerProps extends React.ComponentPropsWithoutRef<typeof TablePrimitives.ResizableTableContainer> {
	resizable?: boolean;
}

const TableContainer = React.forwardRef<HTMLDivElement, TableContainerProps>(
	({ className, onResize, onResizeEnd, onResizeStart, render, resizable = false, ...props }, ref) => {
		const { container } = useStyles()();
		const classNames = container({ className });
		const context = React.useMemo(() => ({ resizable }), [resizable]);

		if (resizable) {
			return (
				<TableContainerContext.Provider value={context}>
					<TablePrimitives.ResizableTableContainer
						data-slot="table-container"
						className={classNames}
						ref={ref}
						onResize={onResize}
						onResizeEnd={onResizeEnd}
						onResizeStart={onResizeStart}
						render={render}
						{...props}
					/>
				</TableContainerContext.Provider>
			);
		}

		return (
			<TableContainerContext.Provider value={context}>
				<div data-slot="table-container" className={classNames} ref={ref} {...props} />
			</TableContainerContext.Provider>
		);
	},
);
TableContainer.displayName = "TableContainer";

// MARK: Separator

interface TableProps extends React.ComponentProps<typeof TablePrimitives.Table> {}

const Table = ({ className, ...props }: TableProps) => {
	const { table } = useStyles()();

	return (
		<TablePrimitives.Table
			data-slot="table"
			className={composeRenderProps(className, (cn) => table({ className: cn }))}
			{...props}
		/>
	);
};

// MARK: Separator

interface TableHeaderProps<T extends object> extends TablePrimitives.TableHeaderProps<T> {}

const TableHeader = <T extends object>({
	className,
	columns,
	children,
	dependencies,
	...props
}: TableHeaderProps<T>) => {
	const { header, selectionColumn } = useStyles()();
	const { resizable } = React.useContext(TableContainerContext);
	const { selectionBehavior, selectionMode, allowsDragging } = TablePrimitives.useTableOptions();
	const dragColumnSize = resizable ? { minWidth: 32, width: 32 } : undefined;
	const selectionColumnSize = resizable ? { minWidth: 40, width: 40 } : undefined;

	return (
		<TablePrimitives.TableHeader
			data-slot="table-header"
			className={composeRenderProps(className, (cn) => header({ className: cn }))}
			dependencies={dependencies}
			{...props}
		>
			{allowsDragging && <TableChromeColumn className="w-8 min-w-8" {...dragColumnSize} />}
			{selectionBehavior === "toggle" && (
				<TableChromeColumn className={selectionColumn()} {...selectionColumnSize}>
					{selectionMode === "multiple" && <Checkbox slot="selection" />}
				</TableChromeColumn>
			)}
			<CollectionPrimitives.Collection items={columns} dependencies={dependencies}>
				{children}
			</CollectionPrimitives.Collection>
		</TablePrimitives.TableHeader>
	);
};

// MARK: Separator

interface InternalColumnProps extends React.ComponentProps<typeof TablePrimitives.Column> {}

const TableChromeColumn = ({ children, className, ...props }: InternalColumnProps) => {
	const { chromeColumn } = useStyles()();
	return (
		<TablePrimitives.Column
			data-slot="table-chrome-column"
			className={composeRenderProps(className, (cn) => chromeColumn({ className: cn }))}
			{...props}
		>
			{children}
		</TablePrimitives.Column>
	);
};

// MARK: Separator

interface TableColumnProps extends React.ComponentProps<typeof TablePrimitives.Column> {
	allowsResizing?: boolean;
}

const TableColumn = ({ allowsResizing, children, className, ...props }: TableColumnProps) => {
	const { column, columnContent, columnLabel, resizer, sortIndicator } = useStyles()();
	const { resizable } = React.useContext(TableContainerContext);
	return (
		<TablePrimitives.Column
			data-slot="table-column"
			className={composeRenderProps(className, (cn) => column({ className: cn }))}
			{...props}
		>
			{composeRenderProps(children, (children, { allowsSorting, sortDirection }) => (
				<div className={columnContent()}>
					<span className={columnLabel()}>{children}</span>
					{allowsSorting && sortDirection && (
						<ArrowUpIcon
							aria-hidden
							className={sortIndicator({ className: sortDirection === "descending" ? "rotate-180" : undefined })}
						/>
					)}
					{resizable && !props.width && allowsResizing && <TablePrimitives.ColumnResizer className={resizer()} />}
				</div>
			))}
		</TablePrimitives.Column>
	);
};

// MARK: Separator

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
	dependencies,
	...props
}: TableBodyProps<T>) => {
	const { body } = useStyles()();
	return (
		<TablePrimitives.TableBody
			renderEmptyState={renderEmptyState}
			className={composeRenderProps(className, (className) => body({ className }))}
			dependencies={dependencies}
			{...props}
		>
			{items !== undefined ? (
				<CollectionPrimitives.Collection items={items} dependencies={dependencies}>
					{children}
				</CollectionPrimitives.Collection>
			) : (
				(children as React.ReactNode)
			)}
			{(isLoading || onLoadMore) && <TableLoadMore isLoading={isLoading} onLoadMore={onLoadMore} />}
		</TablePrimitives.TableBody>
	);
};

// MARK: Separator

interface TableFooterProps<T extends object> extends TablePrimitives.TableFooterProps<T> {}

const TableFooter = <T extends object>({ className, children, dependencies, items, ...props }: TableFooterProps<T>) => {
	const { footer } = useStyles()();
	return (
		<TablePrimitives.TableFooter
			data-slot="table-footer"
			className={footer({ className })}
			dependencies={dependencies}
			{...props}
		>
			<CollectionPrimitives.Collection items={items} dependencies={dependencies}>
				{children}
			</CollectionPrimitives.Collection>
		</TablePrimitives.TableFooter>
	);
};

// MARK: Separator

interface TableRowProps<T extends object> extends TablePrimitives.RowProps<T> {}

function TableRow<T extends object>({ columns, children, className, dependencies, ...props }: TableRowProps<T>) {
	const { dragButton, dragCell, row, selectionCell } = useStyles()();
	const { selectionBehavior, allowsDragging } = TablePrimitives.useTableOptions();

	return (
		<TablePrimitives.Row
			data-slot="table-row"
			className={composeRenderProps(className, (className, { isFocusVisibleWithin }) =>
				row({
					className: cn(
						className,
						isFocusVisibleWithin && "bg-accent-muted/70 hover:bg-accent-muted/70 selected:bg-accent-muted",
					),
				}),
			)}
			dependencies={dependencies}
			{...props}
		>
			{allowsDragging && (
				<TableCell className={dragCell()}>
					<ButtonPrimitives.Button slot="drag" className={dragButton()}>
						<GripVerticalIcon aria-hidden />
					</ButtonPrimitives.Button>
				</TableCell>
			)}
			{selectionBehavior === "toggle" && (
				<TableCell className={selectionCell()}>
					<Checkbox slot="selection" />
				</TableCell>
			)}
			<CollectionPrimitives.Collection items={columns} dependencies={dependencies}>
				{children}
			</CollectionPrimitives.Collection>
		</TablePrimitives.Row>
	);
}

// MARK: Separator

interface TableCellProps extends React.ComponentProps<typeof TablePrimitives.Cell> {}

const TableCell = ({ className, children, style, ...props }: TableCellProps) => {
	const { cell, expandButton, expandIcon } = useStyles()();
	return (
		<TablePrimitives.Cell
			data-slot="table-cell"
			className={composeRenderProps(className, (cn) => cell({ className: cn }))}
			style={composeRenderProps(style, (style, { hasChildItems, isTreeColumn, level }) => ({
				...style,
				paddingInlineStart: isTreeColumn ? 8 + (hasChildItems ? 0 : 20) + (level - 1) * 16 : style?.paddingInlineStart,
			}))}
			{...props}
		>
			{composeRenderProps(children, (children, { hasChildItems, isDisabled, isExpanded, isTreeColumn }) => (
				<>
					{hasChildItems && isTreeColumn && (
						<ButtonPrimitives.Button
							slot="chevron"
							className={expandButton({ className: isDisabled ? "opacity-50" : undefined })}
						>
							<ChevronRightIcon aria-hidden className={cn(expandIcon(), isExpanded && "rotate-90")} />
						</ButtonPrimitives.Button>
					)}
					{children}
				</>
			))}
		</TablePrimitives.Cell>
	);
};

// MARK: Separator

interface TableDropIndicatorProps extends DragAndDropPrimitives.DropIndicatorProps {}

const TableDropIndicator = ({ children, className, ...props }: TableDropIndicatorProps) => {
	const { dropIndicator, dropIndicatorLine } = useStyles()();

	return (
		<DragAndDropPrimitives.DropIndicator
			className={composeRenderProps(className, (cn) => dropIndicator({ className: cn }))}
			{...props}
		>
			{composeRenderProps(children, (children, { isDropTarget }) => (
				<>
					<span aria-hidden className={dropIndicatorLine({ className: isDropTarget ? "opacity-100" : undefined })} />
					{children}
				</>
			))}
		</DragAndDropPrimitives.DropIndicator>
	);
};

interface TableLoadMoreProps extends React.ComponentProps<typeof TablePrimitives.TableLoadMoreItem> {}

const TableLoadMore = ({ className, ...props }: TableLoadMoreProps) => {
	const { loadMore } = useStyles()();
	return (
		<TablePrimitives.TableLoadMoreItem className={loadMore({ className })} {...props}>
			<Loader aria-label="Loading more..." />
		</TablePrimitives.TableLoadMoreItem>
	);
};

// MARK: Separator

export type {
	TableBodyProps,
	TableCellProps,
	TableColumnProps,
	TableContainerProps,
	TableDropIndicatorProps,
	TableFooterProps,
	TableHeaderProps,
	TableVirtualizerProps,
	TableLoadMoreProps,
	TableProps,
	TableRowProps,
};
export {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableContainer,
	TableDropIndicator,
	TableFooter,
	TableHeader,
	TableLayout,
	TableLoadMore,
	TableRow,
	TableVirtualizer,
};
