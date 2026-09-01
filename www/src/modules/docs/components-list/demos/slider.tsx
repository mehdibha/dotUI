import { Label } from "@/registry/ui/field"
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider"

export function SliderDemo() {
  return (
    <Slider defaultValue={64} className="w-full max-w-[11.5rem]">
      <div className="flex items-center justify-between">
        <Label>Opacity</Label>
        <SliderOutput />
      </div>
      <SliderControl />
    </Slider>
  )
}
