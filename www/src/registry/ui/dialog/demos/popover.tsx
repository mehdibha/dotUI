'use client'

import React from 'react'
import type * as MenuPrimitives from 'react-aria-components/Menu'

import { InfoIcon } from '@/registry/__generated__/icons'
import { Responsive } from '@/registry/lib/responsive'
import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import { NumberField } from '@/registry/ui/number-field'
import { Popover } from '@/registry/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import { Switch, SwitchControl } from '@/registry/ui/switch'

export default function Demo() {
  const [placement, setPlacement] = React.useState<MenuPrimitives.Key | null>(
    'top',
  )
  const [offset, setOffset] = React.useState<number>(0)
  const [crossOffset, setCrossOffset] = React.useState<number>(0)
  const [containerPadding, setContainerPadding] = React.useState<number>(0)
  const [showArrow, setShowArrow] = React.useState<boolean>(true)
  return (
    <div className="flex w-full items-center">
      <div className="flex flex-1 items-center justify-center">
        <Dialog>
          <Button variant="default" isIconOnly>
            <InfoIcon />
          </Button>
          <Responsive
            render={(isMobile) => {
              const content = (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Help</DialogTitle>
                    <DialogDescription>
                      For help accessing your account, please contact support.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              )
              return isMobile ? (
                <Drawer>{content}</Drawer>
              ) : (
                <Popover>{content}</Popover>
              )
            }}
          />
        </Dialog>
      </div>
      <div className="space-y-4 rounded-md border p-4">
        <Select value={placement} onChange={setPlacement}>
          <Label>Placement</Label>
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="top">Top</SelectItem>
            <SelectItem id="bottom">Bottom</SelectItem>
          </SelectContent>
        </Select>
        <NumberField value={offset} onChange={setOffset}>
          <Label>Offset</Label>
          <Group>
            <Input />
            <Button slot="decrement" />
            <Button slot="increment" />
          </Group>
        </NumberField>
        <NumberField value={crossOffset} onChange={setCrossOffset}>
          <Label>Cross offset</Label>
          <Group>
            <Input />
            <Button slot="decrement" />
            <Button slot="increment" />
          </Group>
        </NumberField>
        <NumberField value={containerPadding} onChange={setContainerPadding}>
          <Label>Container padding</Label>
          <Group>
            <Input />
            <Button slot="decrement" />
            <Button slot="increment" />
          </Group>
        </NumberField>
        <Switch isSelected={showArrow} onChange={setShowArrow}>
          <SwitchControl />
          <Label>Arrow</Label>
        </Switch>
      </div>
    </div>
  )
}
