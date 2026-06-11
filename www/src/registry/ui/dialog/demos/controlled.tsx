'use client'

import React from 'react'

import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Overlay } from '@/registry/ui/overlay'

export default function Demo() {
  const [isOpen, setOpen] = React.useState(false)
  return (
    <Dialog isOpen={isOpen} onOpenChange={setOpen}>
      <Button>Open dialog</Button>
      <Overlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>This is a heading</DialogTitle>
            <DialogDescription>this is a description</DialogDescription>
          </DialogHeader>
          content here
        </DialogContent>
      </Overlay>
    </Dialog>
  )
}
