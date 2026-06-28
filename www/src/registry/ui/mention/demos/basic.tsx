'use client'

import { Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { Mention } from '@/registry/ui/mention'
import { MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { TextField } from '@/registry/ui/text-field'

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

export default function Demo() {
  return (
    <Mention className="w-[320px]">
      <TextField>
        <Label>Comment</Label>
        <TextArea placeholder="Type @ to mention someone..." />
      </TextField>
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
