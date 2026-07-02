'use client'

import { Button } from '@/registry/ui/button'
import { ColorEditor } from '@/registry/ui/color-editor'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { Label } from '@/registry/ui/field'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <ColorPicker defaultValue="#5100FF">
      {({ color }) => (
        <>
          <div className="flex flex-col gap-2">
            <Label id="brand-color-label">Brand color</Label>
            <Button
              aria-labelledby="brand-color-label"
              className="w-36 justify-start font-normal"
            >
              <ColorSwatch />
              <span className="font-mono text-xs uppercase">
                {color.toString('hex')}
              </span>
            </Button>
          </div>
          <Popover className="p-2.5">
            <ColorEditor />
          </Popover>
        </>
      )}
    </ColorPicker>
  )
}
