import {
  ColorSlider,
  ColorSliderControl,
  ColorSliderOutput,
} from '@/registry/ui/color-slider'
import { Label } from '@/registry/ui/field'

export default function Demo() {
  return (
    <ColorSlider defaultValue="#f00" channel="alpha">
      <div className="flex items-center justify-between">
        <Label>Opacity</Label>
        <ColorSliderOutput />
      </div>
      <ColorSliderControl />
    </ColorSlider>
  )
}
