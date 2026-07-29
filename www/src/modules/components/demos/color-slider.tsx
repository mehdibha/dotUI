'use client'

import * as ColorAreaPrimitives from 'react-aria-components/ColorArea'

import {
  ColorSlider,
  ColorSliderControl,
  ColorSliderOutput,
} from '@/registry/ui/color-slider'
import { Description, Label } from '@/registry/ui/field'

import { useValueAutoplay } from '../autoplay'

// Step the hue through a few stops; the thumb (ColorThumb, positioned via
// `left`) CSS-transitions between them. We rebuild the Color from the numeric
// hue each render — cheaper than animating a Color object per frame, and the
// gradient track + Output update for free.
const HUES = [200, 310, 20, 130]

export function ColorSliderDemo() {
  const { value: hue } = useValueAutoplay(HUES, { dwell: 850 })
  return (
    <ColorSlider
      channel="hue"
      value={ColorAreaPrimitives.parseColor(`hsl(${hue}, 100%, 50%)`)}
      onChange={() => {}}
      className="[&_[data-slot=color-thumb]]:transition-[left,inset-inline-start] [&_[data-slot=color-thumb]]:duration-700 [&_[data-slot=color-thumb]]:ease-out"
    >
      <div className="flex items-center justify-between">
        <Label>Hue</Label>
        <ColorSliderOutput />
      </div>
      <ColorSliderControl />
      <Description>Adjust the hue of the color.</Description>
    </ColorSlider>
  )
}
