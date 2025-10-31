import { Slider, SliderControl } from "@dotui/registry/ui/slider";

export default function Demo() {
  return (
    <Slider aria-label="Opacity" defaultValue={50}>
      <SliderControl />
    </Slider>
  );
}
