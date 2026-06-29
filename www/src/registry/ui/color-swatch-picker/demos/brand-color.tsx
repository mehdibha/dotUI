'use client'

import { useState } from 'react'
import * as ColorAreaPrimitives from 'react-aria-components/ColorArea'

import { Button } from '@/registry/ui/button'
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from '@/registry/ui/color-swatch-picker'
import { Description, Label } from '@/registry/ui/field'

const brandColors = ['#635bff', '#0070f3', '#16a34a', '#ea580c', '#db2777']

export default function Demo() {
  const [value, setValue] = useState<ColorAreaPrimitives.Color>(
    ColorAreaPrimitives.parseColor('#635bff'),
  )

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Label id="brand-color-label">Brand color</Label>
        <Description>Used for buttons, links, and accents.</Description>
      </div>
      <ColorSwatchPicker
        aria-labelledby="brand-color-label"
        value={value}
        onChange={setValue}
      >
        {brandColors.map((color) => (
          <ColorSwatchPickerItem key={color} color={color} />
        ))}
      </ColorSwatchPicker>
      <Button variant="primary" size="sm" className="self-start">
        Save changes
      </Button>
    </div>
  )
}
