'use client'

import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { ColorEditor } from '@/registry/ui/color-editor'

import { OverlayScene, useOpenAutoplay } from '../autoplay'

const COLOR = '#7f007f'

// Trigger → hover → click → the color editor popover unfolds and the scene zooms
// out. The trigger is a real Button showing the current swatch + hex; the surface
// is the real ColorEditor (area + hue slider + hex field).
export function ColorPickerDemo() {
  const { phase } = useOpenAutoplay()
  return (
    <OverlayScene
      phase={phase}
      variant="popover"
      side="bottom"
      surfaceClassName="w-56 p-2"
      trigger={
        <Button className="w-40 justify-start font-normal">
          <span
            aria-hidden
            className="size-4 rounded-sm border border-black/10"
            style={{ backgroundColor: COLOR }}
          />
          <span className="font-mono text-xs tracking-wide uppercase">
            {COLOR}
          </span>
          <ChevronDownIcon className="ml-auto text-fg-muted" />
        </Button>
      }
    >
      <ColorEditor defaultValue={COLOR} showFormatSelector={false} />
    </OverlayScene>
  )
}
