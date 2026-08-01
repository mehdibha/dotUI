import { InfoIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { DialogHeader, DialogTitle } from '@/registry/ui/dialog'

import { OverlayScene } from '../overlay-scene'

export function PopoverDemo() {
  return (
    <OverlayScene
      variant="popover"
      side="bottom"
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
    </OverlayScene>
  )
}
