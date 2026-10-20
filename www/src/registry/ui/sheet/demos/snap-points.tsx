"use client"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Sheet, SheetHandle } from "@/registry/ui/sheet"

export default function Demo() {
  return (
    <Dialog>
      <Button>Open sheet</Button>
      <Sheet snapPoints={[240]}>
        <DialogContent>
          <SheetHandle />
          <DialogHeader>
            <DialogTitle>Harborlight Coffee</DialogTitle>
            <DialogDescription>
              Coffee shop · Open until 6:00 PM
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p>
              The sheet opens partway. Drag it up to read the rest, or swipe it
              down to dismiss.
            </p>
            {Array.from({ length: 6 }).map((_, i) => (
              <p
                // oxlint-disable-next-line react/no-array-index-key -- demo
                key={i}
                className="border-b py-3"
              >
                Review #{i + 1}
              </p>
            ))}
          </DialogBody>
        </DialogContent>
      </Sheet>
    </Dialog>
  )
}
