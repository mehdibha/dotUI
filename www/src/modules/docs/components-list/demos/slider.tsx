import { Slider, SliderControl } from "@/registry/ui/slider"

export function SliderDemo() {
  return (
    <Slider
      aria-label="Opacity"
      defaultValue={64}
      className="w-full max-w-[11.5rem]"
    >
      <SliderControl />
    </Slider>
  )
}
