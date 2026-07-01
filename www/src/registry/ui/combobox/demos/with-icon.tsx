import { GlobeIcon } from 'lucide-react'

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
    <Combobox className="w-52" aria-label="Timezone">
      <InputGroup>
        <InputGroupAddon>
          <GlobeIcon />
        </InputGroupAddon>
        <Input placeholder="Select a timezone" />
      </InputGroup>
      <Popover>
        <ListBox>
          <ListBoxSection>
            <ListBoxSectionHeader>Americas</ListBoxSectionHeader>
            <ListBoxItem>(GMT-5) New York</ListBoxItem>
            <ListBoxItem>(GMT-8) Los Angeles</ListBoxItem>
            <ListBoxItem>(GMT-6) Chicago</ListBoxItem>
            <ListBoxItem>(GMT-3) São Paulo</ListBoxItem>
          </ListBoxSection>
          <ListBoxSection>
            <ListBoxSectionHeader>Europe</ListBoxSectionHeader>
            <ListBoxItem>(GMT+0) London</ListBoxItem>
            <ListBoxItem>(GMT+1) Paris</ListBoxItem>
            <ListBoxItem>(GMT+1) Berlin</ListBoxItem>
          </ListBoxSection>
          <ListBoxSection>
            <ListBoxSectionHeader>Asia/Pacific</ListBoxSectionHeader>
            <ListBoxItem>(GMT+9) Tokyo</ListBoxItem>
            <ListBoxItem>(GMT+8) Singapore</ListBoxItem>
            <ListBoxItem>(GMT+11) Sydney</ListBoxItem>
          </ListBoxSection>
        </ListBox>
      </Popover>
    </Combobox>
  )
}
