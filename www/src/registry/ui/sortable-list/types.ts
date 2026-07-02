/**
 * The shape every sortable item must satisfy: a stable, unique `id` used to
 * track the item across reorders.
 */
export interface SortableItemData {
  /** Stable unique identifier for the item. */
  id: string | number
}

/**
 * A vertical list whose items can be reordered by dragging. Controlled: it
 * renders the `items` you pass and calls `onReorder` with the next order after
 * a drag completes. Render each row through the `children` render prop.
 */
export interface SortableListProps<T extends SortableItemData> extends Omit<
  React.ComponentProps<'div'>,
  'children' | 'onChange'
> {
  /** The ordered list of items to render. Each item needs a unique `id`. */
  items: T[]
  /** Called with the next ordered array after a drag-and-drop reorder. */
  onReorder: (items: T[]) => void
  /** Render prop invoked for each item to produce its row. */
  children: (item: T, index: number) => React.ReactNode
}

/**
 * A single sortable row. Wrap each item from the list's render prop in a
 * `SortableItem`, giving it the same `id` as the underlying data.
 */
export interface SortableItemProps extends Omit<
  React.ComponentProps<'div'>,
  'id'
> {
  /** The item's unique identifier, matching its data `id`. */
  id: string | number
  /** Whether this item is locked in place and cannot be dragged. */
  isDisabled?: boolean
}

/**
 * The drag handle for a `SortableItem`. Renders a grip icon by default and
 * carries the drag listeners; keyboard-accessible (focus it and use the arrow
 * keys to reorder).
 */
export interface SortableItemHandleProps extends React.ComponentProps<'button'> {}

/**
 * The content region of a `SortableItem`, sitting next to the drag handle.
 */
export interface SortableItemContentProps extends React.ComponentProps<'div'> {}
