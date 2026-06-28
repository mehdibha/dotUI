'use client'

import { Input, InputGroup } from '@/registry/ui/input'
import { Mention } from '@/registry/ui/mention'
import { MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'

const people = [
  { id: 'alexmiller' },
  { id: 'sarahjones' },
  { id: 'davidkim' },
  { id: 'emmawatson' },
  { id: 'oliverliu' },
  { id: 'ellagreen' },
]

// A single-line Input instead of a TextArea — the trigger still anchors the
// popover at the caret.
export default function Demo() {
  return (
    <Mention className="w-[320px]">
      <InputGroup>
        <Input aria-label="To" placeholder="Type @ to add someone..." />
      </InputGroup>
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
