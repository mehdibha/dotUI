'use client'

import React from 'react'

import { MenuIcon } from '@/registry/__generated__/icons'
import { Responsive } from '@/registry/lib/responsive'
import { Button } from '@/registry/ui/button'
import { Drawer } from '@/registry/ui/drawer'
import { FieldGroup, Label } from '@/registry/ui/field'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Modal } from '@/registry/ui/modal'
import { Popover } from '@/registry/ui/popover'
import { Radio, RadioGroup } from '@/registry/ui/radio-group'

type Type = 'modal' | 'drawer' | 'popover'

const OVERLAYS: Record<
  Type,
  React.ComponentType<{ children?: React.ReactNode }>
> = {
  modal: Modal,
  drawer: Drawer,
  popover: Popover,
}

export default function Demo() {
  const [type, setType] = React.useState<Type>('popover')
  const [mobileType, setMobileType] = React.useState<Type>('drawer')
  return (
    <div className="flex items-center gap-14">
      <Menu>
        <Button variant="default" isIconOnly>
          <MenuIcon />
        </Button>
        <Responsive
          render={(isMobile) => {
            const Overlay = OVERLAYS[isMobile ? mobileType : type]
            return (
              <Overlay>
                <MenuContent>
                  <MenuItem>Account settings</MenuItem>
                  <MenuItem>Create team</MenuItem>
                  <MenuItem>Command menu</MenuItem>
                  <MenuItem>Log out</MenuItem>
                </MenuContent>
              </Overlay>
            )
          }}
        />
      </Menu>
      <div className="flex items-center gap-6">
        <RadioGroup value={type} onChange={(value) => setType(value as Type)}>
          <Label>Type</Label>
          <FieldGroup>
            <Radio value="popover">Popover</Radio>
            <Radio value="modal">Modal</Radio>
            <Radio value="drawer">Drawer</Radio>
          </FieldGroup>
        </RadioGroup>
        <RadioGroup
          value={mobileType}
          onChange={(value) => setMobileType(value as Type)}
        >
          <Label>MobileType</Label>
          <FieldGroup>
            <Radio value="popover">Popover</Radio>
            <Radio value="modal">Modal</Radio>
            <Radio value="drawer">Drawer</Radio>
          </FieldGroup>
        </RadioGroup>
      </div>
    </div>
  )
}
