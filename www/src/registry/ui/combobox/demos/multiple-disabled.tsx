'use client'

import { Combobox, ComboboxValue } from '@/registry/ui/combobox'
import { Input, InputGroup } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Tag, TagGroup, TagList } from '@/registry/ui/tag-group'

const frameworks = [
  { id: 'next', name: 'Next.js' },
  { id: 'sveltekit', name: 'SvelteKit' },
  { id: 'nuxt', name: 'Nuxt.js' },
  { id: 'remix', name: 'Remix' },
  { id: 'astro', name: 'Astro' },
]

type Framework = (typeof frameworks)[number]

export default function Demo() {
  return (
    <Combobox<Framework, 'multiple'>
      className="max-w-xs"
      aria-label="frameworks"
      selectionMode="multiple"
      defaultValue={['next', 'sveltekit']}
      isDisabled
    >
      <InputGroup>
        <ComboboxValue<Framework>>
          {({ selectedItems }) => (
            <TagGroup aria-label="Selected frameworks">
              <TagList items={selectedItems.filter((item) => item != null)}>
                {(item) => <Tag>{item.name}</Tag>}
              </TagList>
            </TagGroup>
          )}
        </ComboboxValue>
        <Input placeholder="Select frameworks" />
      </InputGroup>
      <Popover>
        <ListBox items={frameworks}>
          {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
        </ListBox>
      </Popover>
    </Combobox>
  )
}
