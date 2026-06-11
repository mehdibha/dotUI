import { Label } from '@/registry/ui/field'
import { Tag, TagGroup, TagList } from '@/registry/ui/tag-group'

export default function Demo() {
  return (
    <TagGroup>
      <Label>Filters</Label>
      <TagList<{ id: string; name: string }>
        items={[]}
        renderEmptyState={() => 'No filters applied.'}
      >
        {(item) => <Tag>{item.name}</Tag>}
      </TagList>
    </TagGroup>
  )
}
