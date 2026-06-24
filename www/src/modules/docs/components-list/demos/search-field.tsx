'use client'

import { SearchIcon, XIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { SearchField } from '@/registry/ui/search-field'

import { DemoFocus, useTypewriter } from '../autoplay'

export function SearchFieldDemo() {
  const { value, active } = useTypewriter('invoices')
  return (
    <SearchField
      aria-label="Search"
      className="w-full max-w-[14rem]"
      value={value}
      onChange={() => {}}
    >
      <InputGroup className="w-full">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <DemoFocus active={active}>
          <Input placeholder="Search..." />
        </DemoFocus>
        <InputGroupAddon>
          <Button variant="quiet" isIconOnly className="rounded-full">
            <XIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </SearchField>
  )
}
