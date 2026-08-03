import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'

import { OverlayScene } from '../overlay-scene'

export function ComboboxDemo() {
  return (
    <OverlayScene
      variant="menu"
      side="bottom"
      fluid
      surfaceClassName="w-full max-w-[11.5rem] p-0"
      trigger={
        <InputGroup className="w-full max-w-[11.5rem]">
          <Input placeholder="Select country..." defaultValue="France" />
          <InputGroupAddon>
            <Button variant="quiet" isIconOnly>
              <ChevronDownIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      }
    >
      <ListBox
        aria-label="Country"
        selectionMode="single"
        defaultSelectedKeys={['france']}
        className="border-0 bg-transparent shadow-none"
      >
        <ListBoxItem id="canada">Canada</ListBoxItem>
        <ListBoxItem id="france">France</ListBoxItem>
        <ListBoxItem id="germany">Germany</ListBoxItem>
      </ListBox>
    </OverlayScene>
  )
}
