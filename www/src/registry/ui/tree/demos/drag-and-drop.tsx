'use client'

import { Collection } from 'react-aria-components/Collection'
import {
  DropIndicator,
  useDragAndDrop,
} from 'react-aria-components/useDragAndDrop'
import { useTreeData } from 'react-stately'

import { Tree, TreeItem, TreeItemContent } from '@/registry/ui/tree'

interface Item {
  id: string
  name: string
  children?: Item[]
}

const initialItems: Item[] = [
  {
    id: 'documents',
    name: 'Documents',
    children: [
      { id: 'report', name: 'Weekly report' },
      { id: 'resume', name: 'Resume.pdf' },
    ],
  },
  {
    id: 'photos',
    name: 'Photos',
    children: [
      { id: 'mountains', name: 'Mountains.jpg' },
      { id: 'beach', name: 'Beach.jpg' },
    ],
  },
]

export default function Demo() {
  const tree = useTreeData<Item>({
    initialItems,
    getKey: (item) => item.id,
    getChildren: (item) => item.children ?? [],
  })

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({
        'text/plain': tree.getItem(key)?.value.name ?? '',
      })),
    renderDropIndicator: (target) => (
      <DropIndicator
        target={target}
        className="z-10 h-0.5 rounded-full bg-transparent outline-hidden data-drop-target:bg-accent"
      />
    ),
    onMove(e) {
      const keys = [...e.keys]
      if (e.target.dropPosition === 'before') {
        tree.moveBefore(e.target.key, keys)
      } else if (e.target.dropPosition === 'after') {
        tree.moveAfter(e.target.key, keys)
      } else if (e.target.dropPosition === 'on') {
        keys.forEach((key, index) => tree.move(key, e.target.key, index))
      }
    },
  })

  return (
    <Tree
      aria-label="Files"
      items={tree.items}
      dragAndDropHooks={dragAndDropHooks}
      defaultExpandedKeys={['documents', 'photos']}
      className="w-72"
    >
      {function renderItem(item) {
        return (
          <TreeItem textValue={item.value.name}>
            <TreeItemContent>{item.value.name}</TreeItemContent>
            <Collection items={item.children ?? []}>{renderItem}</Collection>
          </TreeItem>
        )
      }}
    </Tree>
  )
}
