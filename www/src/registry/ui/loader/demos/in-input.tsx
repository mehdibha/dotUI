'use client'

import { useState } from 'react'
import { SearchIcon } from 'lucide-react'

import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Loader } from '@/registry/ui/loader'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  const [value, setValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  return (
    <TextField
      aria-label="Search"
      className="w-full max-w-xs"
      value={value}
      onChange={(next) => {
        setValue(next)
        setIsSearching(next.length > 0)
        setTimeout(() => setIsSearching(false), 1500)
      }}
    >
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <Input placeholder="Search..." />
        {isSearching && (
          <InputGroupAddon>
            <Loader aria-label="Searching" />
          </InputGroupAddon>
        )}
      </InputGroup>
    </TextField>
  )
}
