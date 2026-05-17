import type * as TablePrimitives from "react-aria-components/Table";
import type * as DragAndDropPrimitives from "react-aria-components/useDragAndDrop";
import type * as VirtualizerPrimitives from "react-aria-components/Virtualizer";

/**
 * The scrollable container for a Table. Set `resizable` to opt into React Aria's resizable table layout.
 */
export interface TableContainerProps extends React.ComponentPropsWithoutRef<
	typeof TablePrimitives.ResizableTableContainer
> {
	/**
	 * Whether to render a React Aria `ResizableTableContainer`.
	 *
	 * When false, the container renders a plain div so the table can use native CSS auto layout.
	 */
	resizable?: boolean;
}

/**
 * A table displays data in rows and columns and enables a user to navigate its contents
 * via directional navigation keys, and optionally supports row selection and sorting.
 */
export interface TableProps extends React.ComponentProps<typeof TablePrimitives.Table> {}

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
 * A footer within a Table, containing summary rows.
 */
export interface TableFooterProps<T extends object> extends TablePrimitives.TableFooterProps<T> {}

/**
 * A row within a Table.
 */
export interface TableRowProps<T extends object> extends TablePrimitives.RowProps<T> {}

/**
 * A cell within a table row.
 */
export interface TableCellProps extends React.ComponentProps<typeof TablePrimitives.Cell> {}

/**
 * A drop indicator rendered between table rows during drag and drop.
 */
export interface TableDropIndicatorProps extends DragAndDropPrimitives.DropIndicatorProps {}

/**
 * A caption for a Table.
 */
export interface TableCaptionProps extends React.ComponentProps<"caption"> {}

/**
 * A loading row that can be used for infinite loading.
 */
export interface TableLoadMoreProps extends React.ComponentProps<typeof TablePrimitives.TableLoadMoreItem> {}

/**
 * A Virtualizer configured with the table layout used by Table.
 */
export interface TableVirtualizerProps<T extends object> extends Omit<
	VirtualizerPrimitives.VirtualizerProps<T>,
	"layout"
> {
	/**
	 * The fixed height of a row in pixels.
	 * Defaults to the current density height: 32 compact, 40 default, 48 comfortable.
	 */
	rowHeight?: number;

	/**
	 * The fixed height of the header in pixels.
	 * Defaults to the current density height: 32 compact, 40 default, 48 comfortable.
	 */
	headingHeight?: number;
}
