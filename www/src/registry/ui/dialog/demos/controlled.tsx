'use client'

import React from 'react'

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
import { Modal } from '@/registry/ui/modal'

export default function Demo() {
  const [isOpen, setOpen] = React.useState(false)
  return (
    <Dialog isOpen={isOpen} onOpenChange={setOpen}>
      <Button>Open dialog</Button>
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>This is a heading</DialogTitle>
                <DialogDescription>this is a description</DialogDescription>
              </DialogHeader>
              content here
            </DialogContent>
          )
          return isMobile ? (
            <Drawer>{content}</Drawer>
          ) : (
            <Modal>{content}</Modal>
          )
        }}
      />
    </Dialog>
  )
}
