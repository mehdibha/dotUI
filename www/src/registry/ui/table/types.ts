import type * as TablePrimitives from "react-aria-components/Table";

/**
 * Missing description.
 */
export interface TableContainerProps extends React.ComponentProps<typeof TablePrimitives.ResizableTableContainer> {
	/**
	 * Whether the table columns are resizable.
	 */
	resizable?: boolean;
}

/**
 * A table displays data in rows and columns and enables a user to navigate its contents
 * via directional navigation keys, and optionally supports row selection and sorting.
 */
export interface TableProps extends React.ComponentProps<typeof TablePrimitives.Table> {
	/**
	 * Whether the table columns are resizable.
	 */
	resizable?: boolean;
}

/**
 * A header within a Table, containing the table columns.
 */
export interface TableHeaderProps<T extends object> extends TablePrimitives.TableHeaderProps<T> {}

/**
 * A column within a Table.
 */
export interface TableColumnProps extends React.ComponentProps<typeof TablePrimitives.Column> {
	/**
	 * Whether the column is resizable.
	 */
	allowsResizing?: boolean;
}

/**
 * The body of a Table, containing the table rows.
 */
export interface TableBodyProps<T extends object> extends TablePrimitives.TableBodyProps<T> {
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
export interface TableRowProps<T extends object> extends TablePrimitives.RowProps<T> {}

/**
 * A cell within a table row.
 */
export interface TableCellProps extends React.ComponentProps<typeof TablePrimitives.Cell> {}

/**
 * Missing description.
 */
export interface TableLoadMoreProps extends React.ComponentProps<typeof TablePrimitives.TableLoadMoreItem> {}
