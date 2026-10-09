"use client"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Sheet, SheetHandle } from "@/registry/ui/sheet"

export default function Demo() {
  return (
    <Dialog>
      <Button>Open scrollable sheet</Button>
      <Sheet>
        <DialogContent>
          <SheetHandle />
          <DialogHeader>
            <DialogTitle>Scrollable content</DialogTitle>
          </DialogHeader>
          <DialogBody className="overflow-y-auto">
            {Array.from({ length: 30 }).map((_, i) => (
              <p
                // oxlint-disable-next-line react/no-array-index-key -- demo
                key={i}
                className="border-b py-3"
              >
                Item #{i + 1}
              </p>
            ))}
          </DialogBody>
        </DialogContent>
      </Sheet>
    </Dialog>
  )
}
