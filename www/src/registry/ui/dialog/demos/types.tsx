'use client'

import React from 'react'

import { PenSquareIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { FieldGroup, Label } from '@/registry/ui/field'
import { Input, TextArea } from '@/registry/ui/input'
import { Overlay } from '@/registry/ui/overlay'
import { Radio, RadioGroup } from '@/registry/ui/radio-group'
import { TextField } from '@/registry/ui/text-field'

type Type = 'modal' | 'drawer' | 'popover'

export default function Demo() {
  const [type, setType] = React.useState<Type>('modal')
  const [mobileType, setMobileType] = React.useState<Type>('drawer')
  return (
    <div className="flex w-full items-center gap-8">
      <Dialog>
        <Button>
          <PenSquareIcon /> Create issue
        </Button>
        <Overlay type={type} mobileType={mobileType}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new issue</DialogTitle>
              <DialogDescription>
                Report an issue or create a feature request.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <TextField aria-label="Title" autoFocus>
                <Input placeholder="Title" className="w-full" />
              </TextField>
              <TextArea
                aria-label="Description"
                placeholder="description"
                className="w-full"
              />
            </DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button slot="close" variant="primary">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
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
