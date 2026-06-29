'use client'

import { Combobox, ComboboxValue } from '@/registry/ui/combobox'
import { Description, FieldError, Label } from '@/registry/ui/field'
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
    <div className="flex max-w-xs flex-col gap-4">
      <Combobox<Framework, 'multiple'>
        aria-label="frameworks"
        selectionMode="multiple"
        defaultValue={['next', 'sveltekit']}
        isInvalid
      >
        <InputGroup>
          <ComboboxValue<Framework>>
            {({ selectedItems, state }) => (
              <TagGroup
                aria-label="Selected frameworks"
                onRemove={(keys) => {
                  if (Array.isArray(state.value)) {
                    state.setValue(state.value.filter((k) => !keys.has(k)))
                  }
                }}
              >
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
      <Combobox<Framework, 'multiple'>
        selectionMode="multiple"
        defaultValue={['next', 'sveltekit', 'nuxt']}
        isInvalid
      >
        <Label>Frameworks</Label>
        <InputGroup>
          <ComboboxValue<Framework>>
            {({ selectedItems, state }) => (
              <TagGroup
                aria-label="Selected frameworks"
                onRemove={(keys) => {
                  if (Array.isArray(state.value)) {
                    state.setValue(state.value.filter((k) => !keys.has(k)))
                  }
                }}
              >
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
        <Description>Please select at least one framework.</Description>
        <FieldError>This field is required.</FieldError>
      </Combobox>
    </div>
  )
}
