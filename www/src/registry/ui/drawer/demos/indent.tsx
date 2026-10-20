"use client"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Drawer, DrawerHandle } from "@/registry/ui/drawer"

export default function Demo() {
  return (
    <Dialog>
      <Button>Open drawer</Button>
      <Drawer>
        <DialogContent>
          <DrawerHandle />
          <DialogHeader>
            <DialogTitle>Notice the page behind</DialogTitle>
          </DialogHeader>
          <DialogBody>
            The whole app scales down while this drawer is open. Drag the handle
            to dismiss.
          </DialogBody>
        </DialogContent>
      </Drawer>
    </Dialog>
  )
}
