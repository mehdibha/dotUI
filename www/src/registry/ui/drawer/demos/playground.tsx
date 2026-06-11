'use client'

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
import { Drawer, type DrawerProps } from '@/registry/ui/drawer'

export default function Demo({ placement = 'bottom' }: DrawerProps = {}) {
  return (
    <Dialog>
      <Button>Open Drawer</Button>
      <Drawer data-control-target placement={placement}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Drawer Title</DialogTitle>
            <DialogDescription>This is a drawer description.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p>Drawer content goes here.</p>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Drawer>
    </Dialog>
  )
}
