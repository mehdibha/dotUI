'use client'

import { TextArea } from '@/registry/ui/input'
import { Mention } from '@/registry/ui/mention'
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

// A bare TextArea — no TextField wrapper. Use `aria-label` for the
// accessible name, or wrap it in a TextField when you want a visible label.
export default function Demo() {
  return (
    <Mention className="w-[320px]">
      <TextArea
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
