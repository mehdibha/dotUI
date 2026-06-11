'use client'

import * as React from 'react'

import { ProgressBar } from '@/registry/ui/progress-bar'
import { Slider, SliderControl } from '@/registry/ui/slider'

export default function Demo() {
  const [value, setValue] = React.useState(50)

  return (
    <div className="flex w-full flex-col gap-4">
      <ProgressBar
        aria-label="Controlled progress"
        value={value}
        className="w-full"
      />
      <Slider
        aria-label="Progress"
        value={value}
        onChange={(value) => setValue(value as number)}
        minValue={0}
        maxValue={100}
        step={1}
      >
        <SliderControl />
      </Slider>
    </div>
  )
}
