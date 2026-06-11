import { Label } from '@/registry/ui/field'
import { Tag, TagGroup, TagList } from '@/registry/ui/tag-group'

export default function Demo() {
  return (
    <TagGroup>
      <Label>Tags</Label>
      <TagList>
        <Tag href="https://react-spectrum.adobe.com/" target="_blank">
          React Aria
        </Tag>
        <Tag href="https://tailwindcss.com" target="_blank">
          Tailwind
        </Tag>
        <Tag href="https://reactrouter.com" target="_blank">
          React Router
        </Tag>
      </TagList>
    </TagGroup>
  )
}
