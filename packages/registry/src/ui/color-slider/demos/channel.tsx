import {
  ColorSlider,
  ColorSliderControl,
  ColorSliderOutput,
} from "@dotui/registry/ui/color-slider";
import { Label } from "@dotui/registry/ui/field";

export default function Demo() {
  return (
    <ColorSlider defaultValue="#f00" channel="alpha">
      <div className="flex items-center justify-between">
        <Label>Opacity</Label>
        <ColorSliderOutput />
      </div>
      <ColorSliderControl />
    </ColorSlider>
  );
}
