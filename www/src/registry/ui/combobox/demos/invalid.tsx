import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Combobox } from '@/registry/ui/combobox'
import { FieldError, Label } from '@/registry/ui/field'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <Combobox aria-label="Country" isInvalid>
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
            <ListBoxItem>Canada</ListBoxItem>
            <ListBoxItem>France</ListBoxItem>
            <ListBoxItem>Germany</ListBoxItem>
            <ListBoxItem>Spain</ListBoxItem>
            <ListBoxItem>Tunisia</ListBoxItem>
            <ListBoxItem>United states</ListBoxItem>
            <ListBoxItem>United Kingdom</ListBoxItem>
          </ListBox>
        </Popover>
      </Combobox>
      <Combobox aria-label="Country" isInvalid>
        <Label>Country</Label>
        <InputGroup>
          <Input placeholder="Select a country..." />
          <InputGroupAddon>
            <Button variant="quiet" isIconOnly>
              <ChevronDownIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <FieldError>Please select a country in the list.</FieldError>
        <Popover>
          <ListBox>
            <ListBoxItem>Canada</ListBoxItem>
            <ListBoxItem>France</ListBoxItem>
            <ListBoxItem>Germany</ListBoxItem>
            <ListBoxItem>Spain</ListBoxItem>
            <ListBoxItem>Tunisia</ListBoxItem>
            <ListBoxItem>United states</ListBoxItem>
            <ListBoxItem>United Kingdom</ListBoxItem>
          </ListBox>
        </Popover>
      </Combobox>
    </div>
  )
}
