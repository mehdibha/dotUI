'use client'

import { Mention } from '@/registry/ui/mention'
import { MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { TokenInput } from '@/registry/ui/token-field'

const people = [
  { id: 'alexmiller' },
  { id: 'sarahjones' },
  { id: 'davidkim' },
  { id: 'emmawatson' },
  { id: 'oliverliu' },
  { id: 'ellagreen' },
]

// Without `allowsNewlines` the field stays single-line: Enter is ignored and
// pasted line breaks collapse to spaces.
export default function Demo() {
  return (
    <Mention className="w-[320px]">
      <TokenInput
        aria-label="To"
        placeholder="Type @ to add someone..."
        className="min-h-0"
      />
      <Popover>
        <MenuContent items={people} renderEmptyState={() => 'No people found.'}>
          {(person) => (
            <MenuItem id={person.id} textValue={person.id}>
              @{person.id}
            </MenuItem>
          )}
        </MenuContent>
      </Popover>
    </Mention>
  )
}
