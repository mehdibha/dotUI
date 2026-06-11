'use client'

import { Label } from '@/registry/ui/field'
import { Slider, SliderControl, SliderOutput } from '@/registry/ui/slider'

export default function Demo() {
  return (
    <Slider defaultValue={50}>
      <div className="flex items-center justify-between">
        <Label>Donuts to buy</Label>
        <SliderOutput>
          {({ state }) => `${state.values[0]} of 100 Donuts`}
        </SliderOutput>
      </div>
      <SliderControl />
    </Slider>
  )
}
