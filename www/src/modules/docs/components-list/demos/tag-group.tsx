import { Label } from '@/registry/ui/field'
import { Tag, TagGroup, TagList } from '@/registry/ui/tag-group'

export function TagGroupDemo() {
  return (
    <TagGroup selectionMode="single" defaultSelectedKeys={['react']}>
      <Label>Tags</Label>
      <TagList>
        <Tag id="react">React</Tag>
        <Tag id="typescript">TypeScript</Tag>
        <Tag id="nextjs">Next.js</Tag>
      </TagList>
    </TagGroup>
  )
}
