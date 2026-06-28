'use client'

import React from 'react'
import * as ColorAreaPrimitives from 'react-aria-components/ColorArea'

import { ColorArea } from '@/registry/ui/color-area'

export default function Demo() {
  const [value, setValue] = React.useState(
    ColorAreaPrimitives.parseColor('hsl(217, 91%, 60%)'),
  )
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-3">
      <ColorArea
        value={value}
        onChange={setValue}
        xChannel="saturation"
        yChannel="lightness"
        aria-label="Brand color"
      />
      <div className="flex w-full items-center gap-2 rounded-md border border-border p-2">
        <div
          className="size-8 shrink-0 rounded-sm border border-border"
          style={{ backgroundColor: value.toString('hex') }}
        />
        <div className="flex flex-col">
          <span className="text-xs font-medium">Brand color</span>
          <span className="text-xs text-fg-muted uppercase">
            {value.toString('hex')}
          </span>
        </div>
      </div>
    </div>
  )
}
