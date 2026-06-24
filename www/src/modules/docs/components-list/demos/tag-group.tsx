'use client'

import { Label } from '@/registry/ui/field'
import { Tag, TagGroup, TagList } from '@/registry/ui/tag-group'

import { useCycle } from '../autoplay'

const KEYS = ['react', 'typescript', 'nextjs']

export function TagGroupDemo() {
  const { item } = useCycle(KEYS, { dwell: 1300 })
  return (
    <TagGroup
      selectionMode="single"
      selectedKeys={[item]}
      onSelectionChange={() => {}}
    >
      <Label>Tags</Label>
      <TagList>
        <Tag id="react">React</Tag>
        <Tag id="typescript">TypeScript</Tag>
        <Tag id="nextjs">Next.js</Tag>
      </TagList>
    </TagGroup>
  )
}
