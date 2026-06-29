import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Combobox } from '@/registry/ui/combobox'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxVirtualizer,
} from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'

const items = Array.from({ length: 1000 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Item ${i + 1}`,
}))

export default function Demo() {
  return (
    <Combobox className="max-w-xs" aria-label="item">
      <InputGroup>
        <Input placeholder="Search from 1000 items" />
        <InputGroupAddon>
          <Button variant="quiet" isIconOnly>
            <ChevronDownIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover className="w-auto p-0">
        <ListBoxVirtualizer>
          <ListBox items={items} className="h-80 w-48 p-0">
            {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
          </ListBox>
        </ListBoxVirtualizer>
      </Popover>
    </Combobox>
  )
}
