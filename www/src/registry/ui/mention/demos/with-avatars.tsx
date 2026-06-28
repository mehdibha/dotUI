'use client'

import { Avatar, AvatarFallback } from '@/registry/ui/avatar'
import { Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { Mention } from '@/registry/ui/mention'
import { MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { TextField } from '@/registry/ui/text-field'

const people = [
  { id: 'alexmiller', name: 'Alex Miller' },
  { id: 'sarahjones', name: 'Sarah Jones' },
  { id: 'davidkim', name: 'David Kim' },
  { id: 'emmawatson', name: 'Emma Watson' },
  { id: 'oliverliu', name: 'Oliver Liu' },
  { id: 'ellagreen', name: 'Ella Green' },
]

export default function Demo() {
  return (
    <Mention className="w-[320px]">
      <TextField>
        <Label>Comment</Label>
        <TextArea placeholder="Type @ to mention someone..." />
      </TextField>
      <Popover>
        <MenuContent items={people} renderEmptyState={() => 'No people found.'}>
          {(person) => (
            <MenuItem id={person.id} textValue={person.id}>
              <Avatar size="sm">
                <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm">{person.name}</span>
                <span className="text-xs text-fg-muted">@{person.id}</span>
              </div>
            </MenuItem>
          )}
        </MenuContent>
      </Popover>
    </Mention>
  )
}
