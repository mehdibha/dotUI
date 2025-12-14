import { Description, Label } from "@dotui/registry/ui/field";
import { Slider, SliderControl } from "@dotui/registry/ui/slider";

export default function Demo() {
  return (
    <Slider defaultValue={50}>
      <Label>Opacity</Label>
      <SliderControl />
      <Description>Adjust the background opacity.</Description>
    </Slider>
  );
}
