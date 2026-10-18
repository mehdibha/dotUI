import { DialogHeader, DialogTitle } from "@/registry/ui/dialog"

import { DrawerPreview } from "../overlay"

export function DrawerDemo() {
  return (
    <DrawerPreview>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
      <p className="mt-1 text-fg-muted">
        Manage your workspace preferences and notifications.
      </p>
    </DrawerPreview>
  )
}
