import type * as TreePrimitives from 'react-aria-components/Tree'

/**
 * A tree provides users with a way to navigate nested hierarchical information,
 * with support for keyboard navigation and selection.
 */
export interface TreeProps<T> extends TreePrimitives.TreeProps<T> {}

/**
 * A TreeItem represents an individual item in a Tree. It can contain a
 * `TreeItemContent` for the row, along with nested `TreeItem`s as children.
 */
export interface TreeItemProps<T> extends TreePrimitives.TreeItemProps<T> {}

/**
 * A TreeItemContent renders the contents of a TreeItem's row: the expand
 * chevron, an optional selection checkbox and drag handle, and the item label.
 */
export interface TreeItemContentProps
  extends TreePrimitives.TreeItemContentProps {}
