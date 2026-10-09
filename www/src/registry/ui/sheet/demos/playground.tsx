"use client"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Sheet, type SheetProps } from "@/registry/ui/sheet"

export default function Demo({ position = "bottom" }: SheetProps = {}) {
  return (
    <Dialog>
      <Button>Open Sheet</Button>
      <Sheet data-control-target position={position}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sheet Title</DialogTitle>
            <DialogDescription>This is a sheet description.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p>Sheet content goes here.</p>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Sheet>
    </Dialog>
  )
}
