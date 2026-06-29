import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Combobox } from '@/registry/ui/combobox'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro']

export default function Demo() {
  return (
    <div className="flex max-w-xs flex-col items-start gap-2">
      <Combobox aria-label="framework">
        <InputGroup className="w-52">
          <Input placeholder="Select a framework" />
          <InputGroupAddon>
            <Button variant="quiet" isIconOnly>
              <ChevronDownIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Popover>
          <ListBox items={frameworks.map((id) => ({ id }))}>
            {(item) => <ListBoxItem id={item.id}>{item.id}</ListBoxItem>}
          </ListBox>
        </Popover>
      </Combobox>
      <Select aria-label="framework" className="w-52">
        <SelectTrigger variant="default" />
        <SelectContent>
          {frameworks.map((framework) => (
            <SelectItem key={framework} id={framework}>
              {framework}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="default" className="w-52 justify-between">
        <span className="text-fg-muted">Select a framework</span>
        <ChevronDownIcon />
      </Button>
      <Input
        aria-label="framework"
        placeholder="Select a framework"
        className="w-52"
      />
      <InputGroup className="w-52">
        <Input placeholder="Select a framework" />
        <InputGroupAddon>
          <ChevronDownIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
