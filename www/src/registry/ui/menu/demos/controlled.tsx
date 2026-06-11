'use client'

import React from 'react'

import { MenuIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  const [isOpen, setOpen] = React.useState(false)
  return (
    <div className="flex flex-col-reverse items-center gap-4">
      <Menu isOpen={isOpen} onOpenChange={setOpen}>
        <Button isIconOnly>
          <MenuIcon />
        </Button>
        <Popover>
          <MenuContent>
            <MenuItem>Account settings</MenuItem>
            <MenuItem>Create team</MenuItem>
            <MenuItem>Log out</MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
      <p className="text-sm text-fg-muted">
        state: {isOpen ? 'open' : 'closed'}
      </p>
    </div>
  )
}
