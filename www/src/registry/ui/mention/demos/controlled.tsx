'use client'

import * as React from 'react'

import { Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { Mention } from '@/registry/ui/mention'
import { MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { TextField } from '@/registry/ui/text-field'

const people = [
  { id: 'alexmiller' },
  { id: 'sarahjones' },
  { id: 'davidkim' },
  { id: 'emmawatson' },
]

export default function Demo() {
  const [value, setValue] = React.useState('Hey ')
  return (
    <div className="flex w-[320px] flex-col gap-2">
      <Mention value={value} onChange={setValue}>
        <TextField>
          <Label>Comment</Label>
          <TextArea placeholder="Type @ to mention someone..." />
        </TextField>
        <Popover>
          <MenuContent items={people}>
            {(person) => (
              <MenuItem id={person.id} textValue={person.id}>
                @{person.id}
              </MenuItem>
            )}
          </MenuContent>
        </Popover>
      </Mention>
      <p className="text-sm text-fg-muted">Value: {value}</p>
    </div>
  )
}
