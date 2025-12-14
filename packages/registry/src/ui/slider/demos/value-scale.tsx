import { Label } from "@dotui/registry/ui/field";
import { Slider, SliderControl } from "@dotui/registry/ui/slider";

export default function Demo() {
  return (
    <Slider minValue={1} maxValue={50} defaultValue={25}>
      <Label>Cookies to</Label>
      <SliderControl />
    </Slider>
  );
}
