"use client"

import React from "react"

import { Button } from "@/registry/ui/button"
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Sheet, SheetHandle } from "@/registry/ui/sheet"

/**
 * Controlled sheet via `isOpen` / `onOpenChange`. Useful when an outside event
 * (effect, message, parent state) needs to open or close the sheet.
 */
export default function Demo() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex items-center gap-3">
      <Button onPress={() => setOpen(true)}>Open</Button>
      <Button variant="quiet" onPress={() => setOpen(false)}>
        Close
      </Button>
      <span className="text-sm text-fg-muted">
        Sheet is {open ? "open" : "closed"}
      </span>
      <Sheet isOpen={open} onOpenChange={setOpen}>
        <DialogContent>
          <SheetHandle />
          <DialogHeader>
            <DialogTitle>Controlled</DialogTitle>
          </DialogHeader>
          <DialogBody>
            Drag to dismiss, click outside, or press Escape -
            `onOpenChange(false)` fires.
          </DialogBody>
        </DialogContent>
      </Sheet>
    </div>
  )
}
