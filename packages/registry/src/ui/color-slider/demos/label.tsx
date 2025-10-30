import {
  ColorSlider,
  ColorSliderControl,
} from "@dotui/registry/ui/color-slider";
import { Label } from "@dotui/registry/ui/field";

export default function Demo() {
  return (
    <ColorSlider
      aria-label="Hue"
      channel="hue"
      defaultValue="hsl(200, 100%, 50%)"
    >
      <Label>Hue</Label>
      <ColorSliderControl />
    </ColorSlider>
  );
}
