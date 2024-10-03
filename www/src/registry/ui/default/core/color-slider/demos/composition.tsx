import {
  ColorSliderOutput,
  ColorSliderRoot,
  ColorSliderTrack,
} from "@/registry/ui/default/core/color-slider";
import { ColorThumb } from "@/registry/ui/default/core/color-thumb";
import { Label } from "@/registry/ui/default/core/field";

export default function Demo() {
  return (
    <ColorSliderRoot channel="hue" defaultValue="hsl(0, 100%, 50%)">
      <div className="flex items-center justify-between">
        <Label>Hue</Label>
        <ColorSliderOutput />
      </div>
      <ColorSliderTrack>
        <ColorThumb />
      </ColorSliderTrack>
    </ColorSliderRoot>
  );
}
