import { BookmarkIcon, FlameIcon, SparklesIcon, TagIcon } from 'lucide-react'

import { Label } from '@/registry/ui/field'
import { Tag, TagGroup, TagList } from '@/registry/ui/tag-group'

export default function Demo() {
  return (
    <TagGroup>
      <Label>Topics</Label>
      <TagList>
        <Tag textValue="General">
          <TagIcon /> General
        </Tag>
        <Tag textValue="Trending">
          <FlameIcon /> Trending
        </Tag>
        <Tag textValue="New">
          <SparklesIcon /> New
        </Tag>
        <Tag textValue="Saved">
          <BookmarkIcon /> Saved
        </Tag>
      </TagList>
    </TagGroup>
  )
}
