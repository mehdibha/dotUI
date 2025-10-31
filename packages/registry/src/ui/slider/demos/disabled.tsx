import { Label } from "@dotui/registry/ui/field";
import { Slider, SliderControl } from "@dotui/registry/ui/slider";

export default function Demo() {
  return (
    <Slider defaultValue={50} isDisabled>
      <Label>Opacity</Label>
      <SliderControl />
    </Slider>
  );
}
