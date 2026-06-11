'use client'

import { Button } from '@/registry/ui/button'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover, type PopoverProps } from '@/registry/ui/popover'

export default function Demo({ placement = 'bottom' }: PopoverProps = {}) {
  return (
    <Menu>
      <Button>Open Menu</Button>
      <Popover data-control-target placement={placement}>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <MenuItem>Archive</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
