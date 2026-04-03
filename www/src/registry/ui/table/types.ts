import type {
	Cell as AriaCell,
	Column as AriaColumn,
	ResizableTableContainer as AriaResizableTableContainer,
	RowProps as AriaRowProps,
	Table as AriaTable,
	TableBodyProps as AriaTableBodyProps,
	TableHeaderProps as AriaTableHeaderProps,
	TableLoadMoreItem as AriaTableLoadMoreItem,
} from "react-aria-components";

/**
 * Missing description.
 */
export interface TableContainerProps extends React.ComponentProps<typeof AriaResizableTableContainer> {
	/**
	 * Whether the table columns are resizable.
	 */
	resizable?: boolean;
}

/**
 * A table displays data in rows and columns and enables a user to navigate its contents
 * via directional navigation keys, and optionally supports row selection and sorting.
 */
export interface TableProps extends React.ComponentProps<typeof AriaTable> {
	/**
	 * Whether the table columns are resizable.
	 */
	resizable?: boolean;
}

/**
 * A header within a Table, containing the table columns.
 */
export interface TableHeaderProps<T extends object> extends AriaTableHeaderProps<T> {}

/**
 * A column within a Table.
 */
export interface TableColumnProps extends React.ComponentProps<typeof AriaColumn> {
	/**
	 * Whether the column is resizable.
	 */
	allowsResizing?: boolean;
}

/**
 * The body of a Table, containing the table rows.
 */
export interface TableBodyProps<T extends object> extends AriaTableBodyProps<T> {
	/**
	 * Whether the table body is in a loading state.
	 */
	isLoading?: boolean;

	/**
	 * Callback fired when more data needs to be loaded.
	 */
	onLoadMore?: () => void;
}

/**
 * A row within a Table.
 */
export interface TableRowProps<T extends object> extends AriaRowProps<T> {}

/**
 * A cell within a table row.
 */
export interface TableCellProps extends React.ComponentProps<typeof AriaCell> {}

/**
 * Missing description.
 */
export interface TableLoadMoreProps extends React.ComponentProps<typeof AriaTableLoadMoreItem> {}
