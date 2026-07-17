'use client'

import * as React from 'react'

import { Label } from '@/registry/ui/field'
import { Mention, MentionInput, TokenSegmentList } from '@/registry/ui/mention'
import { MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'

const people = [
  { id: 'alexmiller' },
  { id: 'sarahjones' },
  { id: 'davidkim' },
  { id: 'emmawatson' },
]

// The value is a TokenSegmentList of text and token segments; toString() joins
// the segments back into plain text.
export default function Demo() {
  const [value, setValue] = React.useState(
    () => new TokenSegmentList([{ type: 'text', text: 'Hey ' }]),
  )
  return (
    <div className="flex w-[320px] flex-col gap-2">
      <Mention allowsNewlines value={value} onChange={setValue}>
        <Label>Comment</Label>
        <MentionInput placeholder="Type @ to mention someone..." />
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
      <p className="text-sm text-fg-muted">Value: {value.toString()}</p>
    </div>
  )
}
