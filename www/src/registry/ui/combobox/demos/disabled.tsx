import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Combobox } from '@/registry/ui/combobox'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <Combobox className="w-52" isDisabled aria-label="Animal">
      <InputGroup>
        <Input placeholder="Select a country..." />
        <InputGroupAddon>
          <Button variant="quiet" isIconOnly>
            <ChevronDownIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover>
        <ListBox>
          <ListBoxItem id="red panda">Red Panda</ListBoxItem>
          <ListBoxItem id="cat">Cat</ListBoxItem>
          <ListBoxItem id="dog">Dog</ListBoxItem>
          <ListBoxItem id="aardvark">Aardvark</ListBoxItem>
          <ListBoxItem id="kangaroo">Kangaroo</ListBoxItem>
          <ListBoxItem id="snake">Snake</ListBoxItem>
        </ListBox>
      </Popover>
    </Combobox>
  )
}
