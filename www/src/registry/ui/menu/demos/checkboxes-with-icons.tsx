'use client'

import React from 'react'
import type { Key } from 'react-aria-components/Menu'

import {
  BellIcon,
  MailIcon,
  MessageSquareIcon,
} from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  const [selected, setSelected] = React.useState<Set<Key>>(
    new Set(['email', 'push']),
  )
  return (
    <Menu>
      <Button variant="default" className="w-fit">
        Notifications
      </Button>
      <Popover>
        <MenuContent
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={(keys) => {
            if (keys !== 'all') setSelected(new Set(keys))
          }}
          className="min-w-56"
        >
          <MenuSection>
            <MenuSectionHeader>Notification Preferences</MenuSectionHeader>
            <MenuItem id="email">
              <MailIcon />
              Email notifications
            </MenuItem>
            <MenuItem id="sms">
              <MessageSquareIcon />
              SMS notifications
            </MenuItem>
            <MenuItem id="push">
              <BellIcon />
              Push notifications
            </MenuItem>
          </MenuSection>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
