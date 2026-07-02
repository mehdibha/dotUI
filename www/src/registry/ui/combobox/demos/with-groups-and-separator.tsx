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
import { Separator } from '@/registry/ui/separator'

const timezones = [
  {
    value: 'Americas',
    items: [
      '(GMT-5) New York',
      '(GMT-8) Los Angeles',
      '(GMT-6) Chicago',
      '(GMT-3) São Paulo',
    ],
  },
  {
    value: 'Europe',
    items: [
      '(GMT+0) London',
      '(GMT+1) Paris',
      '(GMT+1) Berlin',
      '(GMT+1) Rome',
    ],
  },
  {
    value: 'Asia/Pacific',
    items: ['(GMT+9) Tokyo', '(GMT+8) Singapore', '(GMT+11) Sydney'],
  },
]

export default function Demo() {
  return (
    <Combobox className="w-52" aria-label="timezone">
      <InputGroup>
        <Input placeholder="Select a timezone" />
        <InputGroupAddon>
          <Button variant="quiet" isIconOnly>
            <ChevronDownIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover>
        <ListBox>
          {timezones.map((group, index) => (
            <ListBoxSection key={group.value}>
              <ListBoxSectionHeader>{group.value}</ListBoxSectionHeader>
              {group.items.map((item) => (
                <ListBoxItem key={item}>{item}</ListBoxItem>
              ))}
              {index < timezones.length - 1 && <Separator className="my-1" />}
            </ListBoxSection>
          ))}
        </ListBox>
      </Popover>
    </Combobox>
  )
}
