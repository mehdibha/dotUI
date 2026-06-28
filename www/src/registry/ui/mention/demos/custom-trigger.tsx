'use client'

import { Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { Mention } from '@/registry/ui/mention'
import { MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { TextField } from '@/registry/ui/text-field'

const channels = [
  { id: 'general' },
  { id: 'random' },
  { id: 'design' },
  { id: 'engineering' },
  { id: 'product' },
  { id: 'marketing' },
]

export default function Demo() {
  return (
    <Mention trigger="#" className="w-[320px]">
      <TextField>
        <Label>Message</Label>
        <TextArea placeholder="Type # to link a channel..." />
      </TextField>
      <Popover>
        <MenuContent
          items={channels}
          renderEmptyState={() => 'No channels found.'}
        >
          {(channel) => (
            <MenuItem id={channel.id} textValue={channel.id}>
              #{channel.id}
            </MenuItem>
          )}
        </MenuContent>
      </Popover>
    </Mention>
  )
}
