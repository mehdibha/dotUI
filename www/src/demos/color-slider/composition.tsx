import {
  ColorSliderOutput,
  ColorSliderRoot,
  ColorSliderTrack,
} from "@/components/dynamic-core/color-slider";
import { ColorThumb } from "@/components/dynamic-core/color-thumb";
import { Label } from "@/components/dynamic-core/field";

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
