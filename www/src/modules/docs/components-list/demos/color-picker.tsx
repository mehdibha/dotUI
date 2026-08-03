import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { ColorEditor } from '@/registry/ui/color-editor'

import { OverlayScene } from '../overlay-scene'

const COLOR = '#7f007f'

// The trigger is a real Button showing the current swatch + hex; the surface is
// the real ColorEditor (area + hue slider + hex field).
export function ColorPickerDemo() {
  return (
    <OverlayScene
      variant="popover"
      side="bottom"
      openScale={0.66}
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
