'use client'

import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Kbd } from '@/registry/ui/kbd'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <TextField aria-label="Search">
      <InputGroup>
        <Input />
        <InputGroupAddon>
          <Kbd>Space</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </TextField>
  )
}
