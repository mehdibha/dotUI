"use client"

import { Label } from "@/registry/ui/field"
import { Slider, SliderControl, type SliderProps } from "@/registry/ui/slider"

export default function Demo({
  label = "Volume",
  orientation = "horizontal",
  minValue = 0,
  maxValue = 100,
  step = 1,
  isDisabled = false,
}: {
  label?: string
  orientation?: SliderProps["orientation"]
  minValue?: number
  maxValue?: number
  step?: number
  isDisabled?: boolean
} = {}) {
  return (
    <Slider
      defaultValue={50}
      orientation={orientation}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      isDisabled={isDisabled}
    >
      {label && <Label>{label}</Label>}
      <SliderControl />
    </Slider>
  )
}
