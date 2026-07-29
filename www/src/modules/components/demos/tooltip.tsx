'use client'

import { SquarePenIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'

import { OverlayScene, useOpenAutoplay } from '../autoplay'

export function TooltipDemo() {
  const { phase } = useOpenAutoplay()
  return (
    <OverlayScene
      phase={phase}
      variant="tooltip"
      side="top"
      surfaceClassName="inline-flex items-center gap-1.5 whitespace-nowrap"
      trigger={
        <Button aria-label="Create new issue" isIconOnly>
          <SquarePenIcon />
        </Button>
      }
    >
      Create new issue <Kbd>C</Kbd>
    </OverlayScene>
  )
}
