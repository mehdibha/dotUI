'use client'

import { Label } from '@/registry/ui/field'
import { Tag, TagGroup, TagList } from '@/registry/ui/tag-group'

import { useStepAutoplay } from '../autoplay'

const KEYS = ['react', 'typescript', 'nextjs']

export function TagGroupDemo() {
  const { index } = useStepAutoplay(KEYS.length, { dwell: 1300 })
  return (
    <TagGroup
      selectionMode="single"
      selectedKeys={[KEYS[index]]}
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
