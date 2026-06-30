'use client'

import { createContext, useContext } from 'react'
import type * as React from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVerticalIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'

import { useStyles } from './styles'

// MARK: sortableListStyles

// MARK: SortableList

interface SortableItemData {
  id: string | number
}

interface SortableListProps<T extends SortableItemData> extends Omit<
  React.ComponentProps<'div'>,
  'children' | 'onChange'
> {
  items: T[]
  onReorder: (items: T[]) => void
  children: (item: T, index: number) => React.ReactNode
}

function SortableList<T extends SortableItemData>({
  items,
  onReorder,
  children,
  className,
  ...props
}: SortableListProps<T>) {
  const { root } = useStyles()()
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorder(arrayMove(items, oldIndex, newIndex))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div data-sortable-list="" className={root({ className })} {...props}>
          {items.map((item, index) => children(item, index))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

// MARK: SortableItem

interface SortableItemContextValue {
  attributes: ReturnType<typeof useSortable>['attributes']
  listeners: ReturnType<typeof useSortable>['listeners']
  isDisabled: boolean
}

const SortableItemContext = createContext<SortableItemContextValue | null>(null)

interface SortableItemProps extends Omit<React.ComponentProps<'div'>, 'id'> {
  id: string | number
  isDisabled?: boolean
}

function SortableItem({
  id,
  isDisabled = false,
  className,
  children,
  ...props
}: SortableItemProps) {
  const { item } = useStyles()()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isDisabled })

  return (
    <SortableItemContext.Provider value={{ attributes, listeners, isDisabled }}>
      <div
        ref={setNodeRef}
        data-sortable-item=""
        data-dragging={isDragging ? '' : undefined}
        data-disabled={isDisabled ? '' : undefined}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        className={item({ className })}
        {...props}
      >
        {children}
      </div>
    </SortableItemContext.Provider>
  )
}

// MARK: SortableItemHandle

interface SortableItemHandleProps extends React.ComponentProps<'button'> {}

function SortableItemHandle({
  className,
  children,
  ...props
}: SortableItemHandleProps) {
  const { handle } = useStyles()()
  const context = useContext(SortableItemContext)

  return (
    <button
      type="button"
      data-sortable-handle=""
      aria-label="Drag to reorder"
      className={handle({ className })}
      disabled={context?.isDisabled}
      {...context?.attributes}
      {...context?.listeners}
      {...props}
    >
      {children ?? <GripVerticalIcon aria-hidden />}
    </button>
  )
}

// MARK: SortableItemContent

interface SortableItemContentProps extends React.ComponentProps<'div'> {}

function SortableItemContent({
  className,
  ...props
}: SortableItemContentProps) {
  const { content } = useStyles()()
  return (
    <div
      data-sortable-content=""
      className={cn(content(), className)}
      {...props}
    />
  )
}

// MARK: separator

export type {
  SortableItemContentProps,
  SortableItemData,
  SortableItemHandleProps,
  SortableItemProps,
  SortableListProps,
}
export { SortableItem, SortableItemContent, SortableItemHandle, SortableList }
