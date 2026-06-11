'use client'

import * as React from 'react'

import { Label } from '@/registry/ui/field'
import { Tag, TagGroup, TagList } from '@/registry/ui/tag-group'

export default function Demo() {
  const [items, setItems] = React.useState([
    { id: 1, name: 'News' },
    { id: 2, name: 'Travel' },
    { id: 3, name: 'Gaming' },
    { id: 4, name: 'Shopping' },
  ])

  return (
    <TagGroup
      onRemove={(keys) =>
        setItems((prev) => prev.filter((item) => !keys.has(item.id)))
      }
    >
      <Label>Categories</Label>
      <TagList items={items}>{(item) => <Tag>{item.name}</Tag>}</TagList>
    </TagGroup>
  )
}
