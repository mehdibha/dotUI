import {
  ColorSliderControl,
  ColorSliderOutput,
  ColorSliderRoot,
} from "@dotui/registry/ui/color-slider";
import { Label } from "@dotui/registry/ui/field";

export default function Demo() {
  return (
    <ColorSliderRoot channel="hue" defaultValue="hsl(0, 100%, 50%)">
      <div className="flex items-center justify-between">
        <Label>Hue</Label>
        <ColorSliderOutput />
      </div>
      <ColorSliderControl />
    </ColorSliderRoot>
  );
}
