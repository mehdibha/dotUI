import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Combobox } from '@/registry/ui/combobox'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <Combobox aria-label="Animal">
      <InputGroup>
        <Input />
        <InputGroupAddon>
          <Button variant="quiet" isIconOnly>
            <ChevronDownIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover>
        <ListBox isLoading>
          <ListBoxItem>Red Panda</ListBoxItem>
          <ListBoxItem>Cat</ListBoxItem>
          <ListBoxItem>Dog</ListBoxItem>
          <ListBoxItem>Aardvark</ListBoxItem>
          <ListBoxItem>Kangaroo</ListBoxItem>
          <ListBoxItem>Snake</ListBoxItem>
        </ListBox>
      </Popover>
    </Combobox>
  )
}
