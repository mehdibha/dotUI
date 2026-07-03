'use client'

import React from 'react'
import * as ColorAreaPrimitives from 'react-aria-components/ColorArea'

import { Button } from '@/registry/ui/button'
import { ColorEditor } from '@/registry/ui/color-editor'
import { ColorPicker } from '@/registry/ui/color-picker'
import { DialogContent } from '@/registry/ui/dialog'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  const [value, setValue] = React.useState<ColorAreaPrimitives.Color>(
    ColorAreaPrimitives.parseColor('hsl(26, 33%, 78%)'),
  )

  return (
    <ColorPicker value={value} onChange={setValue}>
      <Button aria-label="Pick a color" isIconOnly />
      <Popover>
        <DialogContent>
          <ColorEditor />
        </DialogContent>
      </Popover>
    </ColorPicker>
  )
}
