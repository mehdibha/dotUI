'use client'

import { useState } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  const [value, setValue] = useState('')
  return (
    <TextField
      aria-label="Search members"
      className="w-full max-w-xs"
      value={value}
      onChange={setValue}
    >
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <Input placeholder="Search members..." />
        {value && (
          <InputGroupAddon>
            <Button
              variant="quiet"
              isIconOnly
              aria-label="Clear search"
              onPress={() => setValue('')}
            >
              <XIcon />
            </Button>
          </InputGroupAddon>
        )}
      </InputGroup>
    </TextField>
  )
}
