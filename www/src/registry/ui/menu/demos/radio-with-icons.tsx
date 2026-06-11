'use client'

import React from 'react'
import type { Key } from 'react-aria-components/Menu'

import {
  Building2Icon,
  CreditCardIcon,
  WalletIcon,
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
  const [selected, setSelected] = React.useState<Set<Key>>(new Set(['card']))
  return (
    <Menu>
      <Button variant="default" className="w-fit">
        Payment Method
      </Button>
      <Popover>
        <MenuContent
          selectionMode="single"
          selectedKeys={selected}
          onSelectionChange={(keys) => {
            if (keys !== 'all') setSelected(new Set(keys))
          }}
          className="min-w-56"
        >
          <MenuSection>
            <MenuSectionHeader>Select Payment Method</MenuSectionHeader>
            <MenuItem id="card">
              <CreditCardIcon />
              Credit Card
            </MenuItem>
            <MenuItem id="paypal">
              <WalletIcon />
              PayPal
            </MenuItem>
            <MenuItem id="bank">
              <Building2Icon />
              Bank Transfer
            </MenuItem>
          </MenuSection>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
