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

export interface TableContainerProps
  extends React.ComponentProps<typeof AriaResizableTableContainer> {
  /**
   * Whether the table columns are resizable.
   */
  resizable?: boolean;
}

export interface TableProps extends React.ComponentProps<typeof AriaTable> {
  /**
   * Whether the table columns are resizable.
   */
  resizable?: boolean;
}

export interface TableHeaderProps<T extends object>
  extends AriaTableHeaderProps<T> {}

export interface TableColumnProps
  extends React.ComponentProps<typeof AriaColumn> {
  /**
   * Whether the column is resizable.
   */
  allowsResizing?: boolean;
}

export interface TableBodyProps<T extends object>
  extends AriaTableBodyProps<T> {
  /**
   * Whether the table body is in a loading state.
   */
  isLoading?: boolean;

  /**
   * Callback fired when more data needs to be loaded.
   */
  onLoadMore?: () => void;
}

export interface TableRowProps<T extends object> extends AriaRowProps<T> {}

export interface TableCellProps extends React.ComponentProps<typeof AriaCell> {}

export interface TableLoadMoreProps
  extends React.ComponentProps<typeof AriaTableLoadMoreItem> {}
