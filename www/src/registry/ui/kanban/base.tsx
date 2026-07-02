'use client'

import * as React from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVerticalIcon } from 'lucide-react'

import { createContext } from '@/registry/lib/context'

import { useStyles } from './styles'

// MARK: kanbanStyles

// MARK: types

/** A single card. The board only requires an `id`; add whatever fields your cards need. */
interface KanbanItem {
  id: UniqueIdentifier
}

/** A column and the cards it holds. Add column fields (e.g. a `title`) freely. */
interface KanbanColumnData<TItem extends KanbanItem = KanbanItem> {
  id: UniqueIdentifier
  items: TItem[]
}

// MARK: context

interface KanbanContextValue {
  /** The id of the card currently being dragged, or `null`. */
  activeId: UniqueIdentifier | null
}

const [KanbanContext, useKanbanContext] = createContext<KanbanContextValue>({
  name: 'KanbanBoard',
})

interface KanbanColumnContextValue {
  columnId: UniqueIdentifier
}

const [KanbanColumnContext, useKanbanColumnContext] =
  createContext<KanbanColumnContextValue>({ name: 'KanbanColumn' })

interface KanbanCardHandleContextValue {
  attributes: ReturnType<typeof useSortable>['attributes']
  listeners: ReturnType<typeof useSortable>['listeners']
}

const [KanbanCardHandleContext, useKanbanCardHandleContext] =
  createContext<KanbanCardHandleContextValue>({ name: 'KanbanCard' })

// MARK: helpers

/**
 * Find which column an id belongs to: a column id matches directly, a card id
 * is searched in each column's items.
 */
function findColumnId<TItem extends KanbanItem>(
  columns: KanbanColumnData<TItem>[],
  id: UniqueIdentifier,
): UniqueIdentifier | null {
  if (columns.some((column) => column.id === id)) return id
  const owner = columns.find((column) =>
    column.items.some((item) => item.id === id),
  )
  return owner ? owner.id : null
}

// MARK: KanbanBoard

interface KanbanBoardProps<TColumn extends KanbanColumnData> {
  /** The columns and their cards. The board reorders this on drag. */
  columns: TColumn[]
  /** Called with the next column layout after a card is moved or reordered. */
  onColumnsChange: (columns: TColumn[]) => void
  className?: string
  children?: React.ReactNode
}

/**
 * The board root. Wraps a dnd-kit `DndContext` and implements the
 * multi-container move: `onDragOver` relocates a card across columns mid-drag,
 * `onDragEnd` settles its final order. Compose `KanbanColumn`s (mirroring
 * `columns`) inside, each holding `KanbanCard`s.
 */
function KanbanBoard<TColumn extends KanbanColumnData>({
  columns,
  onColumnsChange,
  className,
  children,
}: KanbanBoardProps<TColumn>) {
  const { root } = useStyles()()
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)

  // The pointer must travel a few pixels before a drag starts, so clicks and
  // text selection inside a card still work.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  // `columns` changes between renders (controlled state); read it from a ref
  // inside the handlers so they always see the latest layout.
  const columnsRef = React.useRef(columns)
  columnsRef.current = columns

  const onDragStart = React.useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id)
  }, [])

  // While dragging over another column, move the card into it immediately so the
  // user sees the relocation in real time. We slot it just before the card under
  // the pointer (or at the end when hovering the empty column body).
  const onDragOver = React.useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) return
      const draggedId = active.id
      const overId = over.id
      const current = columnsRef.current
      const fromColumnId = findColumnId(current, draggedId)
      const toColumnId = findColumnId(current, overId)
      if (
        fromColumnId == null ||
        toColumnId == null ||
        fromColumnId === toColumnId
      ) {
        return
      }

      const fromColumn = current.find((column) => column.id === fromColumnId)
      const toColumn = current.find((column) => column.id === toColumnId)
      if (!fromColumn || !toColumn) return
      const movingItem = fromColumn.items.find((item) => item.id === draggedId)
      if (!movingItem) return

      const overIndex = toColumn.items.findIndex((item) => item.id === overId)
      const insertIndex = overIndex >= 0 ? overIndex : toColumn.items.length

      onColumnsChange(
        current.map((column) => {
          if (column.id === fromColumnId) {
            return {
              ...column,
              items: column.items.filter((item) => item.id !== draggedId),
            }
          }
          if (column.id === toColumnId) {
            const items = [...column.items]
            items.splice(insertIndex, 0, movingItem)
            return { ...column, items }
          }
          return column
        }),
      )
    },
    [onColumnsChange],
  )

  // Settle the order within the destination column once the drag ends. By now
  // `onDragOver` has already placed the card in the right column, so this only
  // reorders inside it.
  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      setActiveId(null)
      const { active, over } = event
      if (!over || active.id === over.id) return
      const current = columnsRef.current
      const columnId = findColumnId(current, over.id)
      if (columnId == null) return
      const column = current.find((entry) => entry.id === columnId)
      if (!column) return
      const oldIndex = column.items.findIndex((item) => item.id === active.id)
      const newIndex = column.items.findIndex((item) => item.id === over.id)
      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return

      onColumnsChange(
        current.map((entry) =>
          entry.id === columnId
            ? { ...entry, items: arrayMove(entry.items, oldIndex, newIndex) }
            : entry,
        ),
      )
    },
    [onColumnsChange],
  )

  const onDragCancel = React.useCallback(() => {
    setActiveId(null)
  }, [])

  const contextValue = React.useMemo<KanbanContextValue>(
    () => ({ activeId }),
    [activeId],
  )

  return (
    <KanbanContext value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <div data-kanban="" className={root({ className })}>
          {children}
        </div>
      </DndContext>
    </KanbanContext>
  )
}

// MARK: KanbanColumn

interface KanbanColumnProps {
  /** Must match the `id` of the corresponding entry in the board's `columns`. */
  id: UniqueIdentifier
  /** The card ids in this column, top to bottom — drives the sortable order. */
  itemIds: UniqueIdentifier[]
  className?: string
  children?: React.ReactNode
}

/**
 * A droppable column with its own `SortableContext`. Compose a
 * `KanbanColumnHeader` and the column's `KanbanCard`s inside it. `itemIds` must
 * list the card ids in their current order.
 */
function KanbanColumn({ id, itemIds, className, children }: KanbanColumnProps) {
  const { column } = useStyles()()
  const { setNodeRef } = useDroppable({ id })
  const contextValue = React.useMemo<KanbanColumnContextValue>(
    () => ({ columnId: id }),
    [id],
  )
  return (
    <KanbanColumnContext value={contextValue}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          data-kanban-column=""
          className={column({ className })}
        >
          {children}
        </div>
      </SortableContext>
    </KanbanColumnContext>
  )
}

// MARK: KanbanColumnHeader

interface KanbanColumnHeaderProps extends React.ComponentProps<'div'> {}

/** The column header row — typically a `KanbanColumnTitle` and a `KanbanColumnCount`. */
function KanbanColumnHeader({ className, ...props }: KanbanColumnHeaderProps) {
  const { columnHeader } = useStyles()()
  return (
    <div
      data-kanban-column-header=""
      className={columnHeader({ className })}
      {...props}
    />
  )
}

// MARK: KanbanColumnTitle

interface KanbanColumnTitleProps extends React.ComponentProps<'h3'> {}

/** The column's title. */
function KanbanColumnTitle({ className, ...props }: KanbanColumnTitleProps) {
  const { columnTitle } = useStyles()()
  return (
    <h3
      data-kanban-column-title=""
      className={columnTitle({ className })}
      {...props}
    />
  )
}

// MARK: KanbanColumnCount

interface KanbanColumnCountProps extends React.ComponentProps<'span'> {}

/** A small badge showing the number of cards in the column. */
function KanbanColumnCount({ className, ...props }: KanbanColumnCountProps) {
  const { columnCount } = useStyles()()
  return (
    <span
      data-kanban-column-count=""
      className={columnCount({ className })}
      {...props}
    />
  )
}

// MARK: KanbanCardList

interface KanbanCardListProps extends React.ComponentProps<'div'> {}

/** The scrollable area that holds a column's cards. */
function KanbanCardList({ className, ...props }: KanbanCardListProps) {
  const { list } = useStyles()()
  return <div data-kanban-list="" className={list({ className })} {...props} />
}

// MARK: KanbanCard

interface KanbanCardProps extends Omit<React.ComponentProps<'div'>, 'id'> {
  /** Must match the `id` of the corresponding item in the board's `columns`. */
  id: UniqueIdentifier
  /**
   * Restrict dragging to a `KanbanCardHandle` instead of the whole card, so the
   * rest of the card stays interactive. @default false
   */
  withHandle?: boolean
}

/**
 * A draggable, sortable card. By default the entire card is the drag handle;
 * pass `withHandle` to restrict dragging to a `KanbanCardHandle` placed inside.
 */
function KanbanCard({
  id,
  withHandle = false,
  className,
  children,
  ...props
}: KanbanCardProps) {
  const { card } = useStyles()()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const handleContext = React.useMemo<KanbanCardHandleContextValue>(
    () => ({ attributes, listeners }),
    [attributes, listeners],
  )

  // Without an explicit handle, the whole card is the handle: spread the drag
  // listeners + a11y attributes onto the root.
  const dragProps = withHandle ? {} : { ...attributes, ...listeners }

  return (
    <KanbanCardHandleContext value={handleContext}>
      <div
        ref={setNodeRef}
        data-kanban-card=""
        data-dragging={isDragging ? '' : undefined}
        style={style}
        className={card({ className })}
        {...dragProps}
        {...props}
      >
        {children}
      </div>
    </KanbanCardHandleContext>
  )
}

// MARK: KanbanCardHandle

interface KanbanCardHandleProps extends React.ComponentProps<'button'> {}

/**
 * An explicit drag handle for a `KanbanCard` rendered with `withHandle`. Place
 * it anywhere inside the card; only it initiates a drag.
 */
function KanbanCardHandle({
  className,
  children,
  ...props
}: KanbanCardHandleProps) {
  const { attributes, listeners } =
    useKanbanCardHandleContext('KanbanCardHandle')
  return (
    <button
      type="button"
      data-kanban-card-handle=""
      aria-label="Drag card"
      className={className}
      {...attributes}
      {...listeners}
      {...props}
    >
      {children ?? <GripVerticalIcon className="size-4" />}
    </button>
  )
}

// MARK: KanbanDragOverlay

interface KanbanDragOverlayProps {
  children?: (activeId: UniqueIdentifier) => React.ReactNode
}

/**
 * Renders a floating copy of the card under the cursor while dragging, detached
 * from the column's scroll/overflow. `children` is called with the active id.
 */
function KanbanDragOverlay({ children }: KanbanDragOverlayProps) {
  const { activeId } = useKanbanContext('KanbanDragOverlay')
  return (
    <DragOverlay>
      {activeId != null && children ? children(activeId) : null}
    </DragOverlay>
  )
}

// MARK: separator

export type {
  KanbanBoardProps,
  KanbanCardHandleContextValue,
  KanbanCardHandleProps,
  KanbanCardListProps,
  KanbanCardProps,
  KanbanColumnContextValue,
  KanbanColumnCountProps,
  KanbanColumnData,
  KanbanColumnHeaderProps,
  KanbanColumnProps,
  KanbanColumnTitleProps,
  KanbanContextValue,
  KanbanDragOverlayProps,
  KanbanItem,
}
export {
  KanbanBoard,
  KanbanCard,
  KanbanCardHandle,
  KanbanCardList,
  KanbanColumn,
  KanbanColumnCount,
  KanbanColumnHeader,
  KanbanColumnTitle,
  KanbanDragOverlay,
  useKanbanCardHandleContext,
  useKanbanColumnContext,
  useKanbanContext,
}
