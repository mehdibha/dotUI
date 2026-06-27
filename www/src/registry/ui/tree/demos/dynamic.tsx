'use client'

import { Collection } from 'react-aria-components/Collection'

import { Tree, TreeItem, TreeItemContent } from '@/registry/ui/tree'

interface Item {
  id: string
  name: string
  children?: Item[]
}

const items: Item[] = [
  {
    id: 'documents',
    name: 'Documents',
    children: [
      {
        id: 'project',
        name: 'Project',
        children: [{ id: 'report', name: 'Weekly report' }],
      },
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
  return (
    <Tree
      aria-label="Files"
      items={items}
      defaultExpandedKeys={['documents']}
      className="w-72"
    >
      {function renderItem(item: Item) {
        return (
          <TreeItem textValue={item.name}>
            <TreeItemContent>{item.name}</TreeItemContent>
            {item.children && (
              <Collection items={item.children}>{renderItem}</Collection>
            )}
          </TreeItem>
        )
      }}
    </Tree>
  )
}
