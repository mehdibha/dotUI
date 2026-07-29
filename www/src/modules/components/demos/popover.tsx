'use client'

import { InfoIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { DialogHeader, DialogTitle } from '@/registry/ui/dialog'

import { OverlayScene, useOpenAutoplay } from '../autoplay'

export function PopoverDemo() {
  const { phase } = useOpenAutoplay()
  return (
    <OverlayScene
      phase={phase}
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
