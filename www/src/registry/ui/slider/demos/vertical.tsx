import { Slider, SliderControl } from '@/registry/ui/slider'

export default function Demo() {
  return (
    <Slider
      defaultValue={50}
      aria-label="Opacity"
      orientation="vertical"
      className="w-8"
    >
      <SliderControl />
    </Slider>
  )
}
