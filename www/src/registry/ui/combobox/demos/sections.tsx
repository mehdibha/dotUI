import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Combobox } from '@/registry/ui/combobox'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <Combobox aria-label="Country">
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
          <ListBoxSection>
            <ListBoxSectionHeader>Africa</ListBoxSectionHeader>
            <ListBoxItem>Tunisia</ListBoxItem>
            <ListBoxItem>Algeria</ListBoxItem>
            <ListBoxItem>Morocco</ListBoxItem>
          </ListBoxSection>
          <ListBoxSection>
            <ListBoxSectionHeader>America</ListBoxSectionHeader>
            <ListBoxItem>Canada</ListBoxItem>
            <ListBoxItem>United states</ListBoxItem>
          </ListBoxSection>
          <ListBoxSection>
            <ListBoxSectionHeader>Asia</ListBoxSectionHeader>
            <ListBoxItem>India</ListBoxItem>
            <ListBoxItem>Japan</ListBoxItem>
            <ListBoxItem>Korea</ListBoxItem>
          </ListBoxSection>
          <ListBoxSection>
            <ListBoxSectionHeader>Europe</ListBoxSectionHeader>
            <ListBoxItem>France</ListBoxItem>
            <ListBoxItem>Germany</ListBoxItem>
            <ListBoxItem>Spain</ListBoxItem>
            <ListBoxItem>United Kingdom</ListBoxItem>
          </ListBoxSection>
        </ListBox>
      </Popover>
    </Combobox>
  )
}
