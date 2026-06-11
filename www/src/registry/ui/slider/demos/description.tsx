import { Description, Label } from '@/registry/ui/field'
import { Slider, SliderControl } from '@/registry/ui/slider'

export default function Demo() {
  return (
    <Slider defaultValue={50}>
      <Label>Opacity</Label>
      <SliderControl />
      <Description>Adjust the background opacity.</Description>
    </Slider>
  )
}
