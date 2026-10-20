import { DialogHeader, DialogTitle } from "@/registry/ui/dialog"

import { SheetPreview } from "../overlay"

export function SheetDemo() {
  return (
    <SheetPreview>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
      <p className="mt-1 text-fg-muted">
        Manage your workspace preferences and notifications.
      </p>
    </SheetPreview>
  )
}
