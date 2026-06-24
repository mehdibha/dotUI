'use client'

import * as ColorAreaPrimitives from 'react-aria-components/ColorArea'

import { ColorArea } from '@/registry/ui/color-area'

import { useStepAutoplay } from '../autoplay'

// Cycle a handful of colors spread across the 2D area; the thumb (ColorThumb,
// positioned via `left`/`top`) CSS-transitions between the spots so it glides
// diagonally instead of jumping.
const COLORS = [
  ColorAreaPrimitives.parseColor('hsl(0, 90%, 30%)'),
  ColorAreaPrimitives.parseColor('hsl(0, 25%, 75%)'),
  ColorAreaPrimitives.parseColor('hsl(0, 95%, 60%)'),
  ColorAreaPrimitives.parseColor('hsl(0, 40%, 20%)'),
]

export function ColorAreaDemo() {
  const { index } = useStepAutoplay(COLORS.length, { dwell: 1000 })
  return (
    <ColorArea
      value={COLORS[index]}
      onChange={() => {}}
      className="[&_[data-slot=color-thumb]]:transition-[left,top] [&_[data-slot=color-thumb]]:duration-700 [&_[data-slot=color-thumb]]:ease-out"
    />
  )
}
