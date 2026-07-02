'use client'

import { Button } from '@/registry/ui/button'
import { ColorEditor } from '@/registry/ui/color-editor'
import { ColorPicker } from '@/registry/ui/color-picker'
import { DialogContent } from '@/registry/ui/dialog'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <ColorPicker defaultValue="#ff0000">
      <Button aria-label="Pick a color" />
      <Popover>
        <DialogContent>
          <ColorEditor />
        </DialogContent>
      </Popover>
    </ColorPicker>
  )
}
