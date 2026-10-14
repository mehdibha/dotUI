import { DialogHeader, DialogTitle } from "@/registry/ui/dialog"

import { OverlayPreview, PageMock } from "../overlay"

export function SheetDemo() {
  return (
    <OverlayPreview variant="sheet" page={<PageMock />}>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
      <p className="mt-1 text-fg-muted">
        Manage your workspace preferences and notifications.
      </p>
    </OverlayPreview>
  )
}
