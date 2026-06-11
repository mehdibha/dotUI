'use client'

import React from 'react'
import { type Color, parseColor } from 'react-aria-components/ColorField'

import { ColorField } from '@/registry/ui/color-field'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'

export default function Demo() {
  const [color, setColor] = React.useState<Color | null>(parseColor('#7f007f'))

  return (
    <div className="grid w-full grid-cols-3 gap-2">
      <ColorField
        colorSpace="hsl"
        channel="hue"
        value={color}
        onChange={setColor}
      >
        <Label>Hue</Label>
        <Input />
      </ColorField>

      <ColorField
        colorSpace="hsl"
        channel="saturation"
        value={color}
        onChange={setColor}
      >
        <Label>Saturation</Label>
        <Input />
      </ColorField>

      <ColorField
        colorSpace="hsl"
        channel="lightness"
        value={color}
        onChange={setColor}
      >
        <Label>Lightness</Label>
        <Input />
      </ColorField>
    </div>
  )
}
