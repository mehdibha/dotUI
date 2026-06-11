'use client'

import React from 'react'

import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { FieldGroup, Label } from '@/registry/ui/field'
import { Overlay } from '@/registry/ui/overlay'
import { Radio, RadioGroup } from '@/registry/ui/radio-group'

type Type = 'modal' | 'drawer' | 'popover'

export default function Demo() {
  const [type, setType] = React.useState<Type>('modal')
  const [mobileType, setMobileType] = React.useState<Type>('drawer')
  return (
    <div className="flex w-full items-center gap-8">
      <Dialog>
        <Button>Open</Button>
        <Overlay type={type} mobileType={mobileType}>
          <DialogContent>some content</DialogContent>
        </Overlay>
      </Dialog>

      <RadioGroup value={type} onChange={(value) => setType(value as Type)}>
        <Label>Type</Label>
        <FieldGroup>
          <Radio value="modal">Modal</Radio>
          <Radio value="drawer">Drawer</Radio>
          <Radio value="popover">Popover</Radio>
        </FieldGroup>
      </RadioGroup>

      <RadioGroup
        value={mobileType}
        onChange={(value) => setMobileType(value as Type)}
      >
        <Label>Mobile type</Label>
        <FieldGroup>
          <Radio value="modal">Modal</Radio>
          <Radio value="drawer">Drawer</Radio>
          <Radio value="popover">Popover</Radio>
        </FieldGroup>
      </RadioGroup>
    </div>
  )
}
