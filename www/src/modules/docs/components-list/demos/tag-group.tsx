import { Label } from '@/registry/ui/field'
import { Tag, TagGroup, TagList } from '@/registry/ui/tag-group'

export function TagGroupDemo() {
  return (
    <TagGroup>
      <Label>Tags</Label>
      <TagList>
        <Tag>React</Tag>
        <Tag>TypeScript</Tag>
        <Tag>Next.js</Tag>
      </TagList>
    </TagGroup>
  )
}
