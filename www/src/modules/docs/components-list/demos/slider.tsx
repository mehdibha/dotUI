import { Slider, SliderControl } from "@/registry/ui/slider"

export function SliderDemo() {
  return (
    <Slider aria-label="Opacity" defaultValue={64} className="w-full max-w-46">
      <SliderControl />
    </Slider>
  )
}
