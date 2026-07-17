'use client'

import { Mention, MentionInput } from '@/registry/ui/mention'
import { MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'

const usernames = [
  'alexmiller',
  'sarahjones',
  'davidkim',
  'emmawatson',
  'oliverliu',
  'ellagreen',
  'lucasbrown',
  'amandarivera',
  'masonlee',
  'nataliasmith',
].map((id) => ({ id }))

// A bare MentionInput — no visible label. Use `aria-label` for the accessible
// name, or add a <Label> when you want a visible one.
export default function Demo() {
  return (
    <Mention allowsNewlines className="w-[320px]">
      <MentionInput
        aria-label="Comment"
        placeholder="Type @ to mention someone..."
      />
      <Popover>
        <MenuContent
          items={usernames}
          renderEmptyState={() => 'No results found.'}
        >
          {(item) => (
            <MenuItem id={item.id} textValue={item.id}>
              {item.id}
            </MenuItem>
          )}
        </MenuContent>
      </Popover>
    </Mention>
  )
}
