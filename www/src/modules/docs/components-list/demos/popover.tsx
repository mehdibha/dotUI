import { InfoIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { DialogHeader, DialogTitle } from "@/registry/ui/dialog"

import { OverlayPreview } from "../overlay"

export function PopoverDemo() {
  return (
    <OverlayPreview
      variant="popover"
      surfaceClassName="w-52 text-left"
      trigger={
        <Button aria-label="Help" isIconOnly>
          <InfoIcon />
        </Button>
      }
    >
      <DialogHeader>
        <DialogTitle>Need help?</DialogTitle>
      </DialogHeader>
      <p className="mt-1 text-fg-muted">
        If you&apos;re having issues, contact our customer support team.
      </p>
    </OverlayPreview>
  )
}
