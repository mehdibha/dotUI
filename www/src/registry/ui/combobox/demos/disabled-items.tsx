import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Combobox } from '@/registry/ui/combobox'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'

const frameworks = [
  { id: 'next', name: 'Next.js' },
  { id: 'sveltekit', name: 'SvelteKit' },
  { id: 'nuxt', name: 'Nuxt.js' },
  { id: 'remix', name: 'Remix' },
  { id: 'astro', name: 'Astro' },
]

const disabledKeys = ['nuxt', 'remix']

export default function Demo() {
  return (
    <Combobox
      className="max-w-xs"
      aria-label="framework"
      disabledKeys={disabledKeys}
    >
      <InputGroup>
        <Input placeholder="Select a framework" />
        <InputGroupAddon>
          <Button variant="quiet" isIconOnly>
            <ChevronDownIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover>
        <ListBox items={frameworks}>
          {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
        </ListBox>
      </Popover>
    </Combobox>
  )
}
