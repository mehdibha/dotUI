import {
  ColorSlider,
  ColorSliderControl,
  ColorSliderOutput,
} from '@/registry/ui/color-slider'
import { Description, Label } from '@/registry/ui/field'

export function ColorSliderDemo() {
  return (
    <ColorSlider channel="hue" defaultValue="hsl(200, 100%, 50%)">
      <div className="flex items-center justify-between">
        <Label>Hue</Label>
        <ColorSliderOutput />
      </div>
      <ColorSliderControl />
      <Description>Adjust the hue of the color.</Description>
    </ColorSlider>
  )
}
