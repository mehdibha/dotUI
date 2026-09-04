import { InfoIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { DialogHeader, DialogTitle } from "@/registry/ui/dialog"

import { Surface } from "../overlay"

export function PopoverDemo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button aria-label="Help" isIconOnly>
        <InfoIcon />
      </Button>
      <Surface variant="popover" className="w-52 text-left">
        <DialogHeader>
          <DialogTitle>Need help?</DialogTitle>
        </DialogHeader>
        <p className="mt-1 text-fg-muted">
          If you&apos;re having issues, contact our customer support team.
        </p>
      </Surface>
    </div>
  )
}
