'use client'

import { Label } from '@/registry/ui/field'
import { Mention } from '@/registry/ui/mention'
import { MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { TokenInput } from '@/registry/ui/token-field'

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
    <Mention allowsNewlines trigger="#" className="w-[320px]">
      <Label>Message</Label>
      <TokenInput placeholder="Type # to link a channel..." />
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
