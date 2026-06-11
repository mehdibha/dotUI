'use client'

import React from 'react'
import * as ColorAreaPrimitives from 'react-aria-components/ColorArea'

import { ColorSlider, ColorSliderControl } from '@/registry/ui/color-slider'

export default function Demo() {
  const [value, setValue] = React.useState(
    ColorAreaPrimitives.parseColor('hsl(0, 100%, 50%)'),
  )

  return (
    <div className="flex flex-col items-center gap-4">
      <ColorSlider
        aria-label="Hue"
        value={value}
        onChange={setValue}
        channel="hue"
      >
        <ColorSliderControl />
      </ColorSlider>
      <p className="text-xs text-fg-muted">Value: {value.toString('hex')}</p>
    </div>
  )
}
