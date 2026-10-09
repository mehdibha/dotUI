"use client"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Sheet } from "@/registry/ui/sheet"

export default function Demo() {
  return (
    <Dialog>
      <Button>Open sheet</Button>
      <Sheet preventDismissal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
          </DialogHeader>
          <DialogBody>
            Swiping, clicking outside and Escape don't dismiss it. Use the
            button below.
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Acknowledge</Button>
          </DialogFooter>
        </DialogContent>
      </Sheet>
    </Dialog>
  )
}
