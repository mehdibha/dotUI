import { SquarePenIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'

import { OverlayScene } from '../overlay-scene'

export function TooltipDemo() {
  return (
    <OverlayScene
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
