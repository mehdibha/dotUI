'use client'

import { Slider, SliderControl } from '@/registry/ui/slider'

import { useValueAutoplay } from '../autoplay'

// Discrete waypoints; the CSS transitions on the thumb/fill (added via the
// className below) glide between them — cheaper and more reliable than a
// per-frame value tween.
export function SliderDemo() {
  const { value } = useValueAutoplay([50, 80, 92, 64], { dwell: 850 })
  return (
    <Slider
      aria-label="Opacity"
      value={value}
      onChange={() => {}}
      className="w-64 [&_[data-slider-fill]]:transition-[width,inset-inline-start] [&_[data-slider-fill]]:duration-700 [&_[data-slider-fill]]:ease-out [&_[data-slider-thumb]]:transition-[left,inset-inline-start] [&_[data-slider-thumb]]:duration-700 [&_[data-slider-thumb]]:ease-out"
    >
      <SliderControl />
    </Slider>
  )
}
