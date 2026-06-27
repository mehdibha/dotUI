'use client'

import * as ColorAreaPrimitives from 'react-aria-components/ColorArea'

import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from '@/registry/ui/color-swatch-picker'

import { useCycle } from '../autoplay'

// Selection is controlled by a Color matched against each item's `color`, so we
// cycle `value` through the swatches — the selected one lights up its ring.
const SWATCHES = [
  '#FF6B6B',
  '#FFA07A',
  '#FFD93D',
  '#6BCB77',
  '#4D96FF',
  '#A29BFE',
]

export function ColorSwatchPickerDemo() {
  const { item } = useCycle(SWATCHES, { dwell: 750 })
  return (
    <ColorSwatchPicker
      value={ColorAreaPrimitives.parseColor(item)}
      onChange={() => {}}
    >
      {SWATCHES.map((color) => (
        <ColorSwatchPickerItem key={color} color={color} />
      ))}
    </ColorSwatchPicker>
  )
}
