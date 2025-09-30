import { Slider } from "@dotui/registry/ui/slider";

export default function Demo() {
  return (
    <Slider
      label="Opacity"
      showValueLabel
      minValue={0}
      maxValue={100}
      step={5}
    />
  );
}
