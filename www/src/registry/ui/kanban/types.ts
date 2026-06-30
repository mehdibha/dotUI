import type { UniqueIdentifier } from '@dnd-kit/core'

import type { KanbanColumnData } from './base'

/**
 * The board root. Wraps the drag-and-drop context and implements moving cards
 * within and between columns. Compose `KanbanColumn`s inside it, mirroring the
 * `columns` data.
 */
export interface KanbanBoardProps<
  TColumn extends KanbanColumnData = KanbanColumnData,
> {
  /** The columns and their cards. The board reorders this on drag. */
  columns: TColumn[]
  /** Called with the next column layout after a card is moved or reordered. */
  onColumnsChange: (columns: TColumn[]) => void
  className?: string
  children?: React.ReactNode
}

/**
 * A droppable column with its own sortable context. Holds a header and the
 * column's cards.
 */
export interface KanbanColumnProps {
  /** Must match the `id` of the corresponding entry in the board's `columns`. */
  id: UniqueIdentifier
  /** The card ids in this column, top to bottom — drives the sortable order. */
  itemIds: UniqueIdentifier[]
  className?: string
  children?: React.ReactNode
}

/**
 * The column header row, typically containing a `KanbanColumnTitle` and a
 * `KanbanColumnCount`.
 */
export interface KanbanColumnHeaderProps extends React.ComponentProps<'div'> {}

/** The column's title. */
export interface KanbanColumnTitleProps extends React.ComponentProps<'h3'> {}

/** A small badge showing the number of cards in the column. */
export interface KanbanColumnCountProps extends React.ComponentProps<'span'> {}

/** The scrollable area that holds a column's cards. */
export interface KanbanCardListProps extends React.ComponentProps<'div'> {}

/** A draggable, sortable card. */
export interface KanbanCardProps extends Omit<
  React.ComponentProps<'div'>,
  'id'
> {
  /** Must match the `id` of the corresponding item in the board's `columns`. */
  id: UniqueIdentifier
  /**
   * Restrict dragging to a `KanbanCardHandle` instead of the whole card, so the
   * rest of the card stays interactive.
   * @default false
   */
  withHandle?: boolean
}

/**
 * An explicit drag handle for a `KanbanCard` rendered with `withHandle`. Only
 * it initiates a drag.
 */
export interface KanbanCardHandleProps extends React.ComponentProps<'button'> {}

/**
 * Renders a floating copy of the card under the cursor while dragging, detached
 * from the column's scroll and overflow.
 */
export interface KanbanDragOverlayProps {
  /** Called with the active card id to render the overlay contents. */
  children?: (activeId: UniqueIdentifier) => React.ReactNode
}
