import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Combobox } from '@/registry/ui/combobox'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <Combobox aria-label="country" defaultSelectedKey="tn">
      <InputGroup>
        <Input />
        <InputGroupAddon>
          <Button variant="quiet" isIconOnly>
            <ChevronDownIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover>
        <ListBox>
          <ListBoxItem id="ca">Canada</ListBoxItem>
          <ListBoxItem id="fr">France</ListBoxItem>
          <ListBoxItem id="de">Germany</ListBoxItem>
          <ListBoxItem id="es">Spain</ListBoxItem>
          <ListBoxItem id="tn">Tunisia</ListBoxItem>
          <ListBoxItem id="us">United States</ListBoxItem>
          <ListBoxItem id="uk">United Kingdom</ListBoxItem>
        </ListBox>
      </Popover>
    </Combobox>
  )
}
