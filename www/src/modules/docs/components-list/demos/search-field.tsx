'use client'

import { SearchIcon, XIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { SearchField } from '@/registry/ui/search-field'

import { demoFocusProps, useTypewriter } from '../autoplay'

export function SearchFieldDemo() {
  const { value, active } = useTypewriter('invoices')
  return (
    <SearchField
      aria-label="Search"
      className="w-full"
      value={value}
      onChange={() => {}}
    >
      <InputGroup className="w-full" {...demoFocusProps(active)}>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <Input placeholder="Search..." />
        <InputGroupAddon>
          <Button variant="quiet" isIconOnly className="rounded-full">
            <XIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </SearchField>
  )
}
