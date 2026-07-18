'use client'

import {
  DropIndicator,
  useDragAndDrop,
} from 'react-aria-components/useDragAndDrop'
import { useListData } from 'react-stately'

import { GridList, GridListItem } from '@/registry/ui/grid-list'

const initialItems = [
  { id: 'inbox', name: 'Inbox' },
  { id: 'today', name: 'Today' },
  { id: 'upcoming', name: 'Upcoming' },
  { id: 'someday', name: 'Someday' },
]

export default function Demo() {
  const list = useListData({ initialItems })

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({
        'text/plain': list.getItem(key)?.name ?? '',
      })),
    renderDropIndicator: (target) => (
      <DropIndicator
        target={target}
        className="z-10 h-0.5 rounded-full bg-transparent outline-hidden data-drop-target:bg-accent"
      />
    ),
    onReorder(e) {
      if (e.target.dropPosition === 'before') {
        list.moveBefore(e.target.key, e.keys)
      } else if (e.target.dropPosition === 'after') {
        list.moveAfter(e.target.key, e.keys)
      }
    },
  })

  return (
    <div className="w-64 rounded-md border bg-card shadow-sm">
      <GridList
        aria-label="Lists"
        items={list.items}
        dragAndDropHooks={dragAndDropHooks}
      >
        {(item) => <GridListItem>{item.name}</GridListItem>}
      </GridList>
    </div>
  )
}
