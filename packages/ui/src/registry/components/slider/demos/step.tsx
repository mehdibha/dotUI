import { Slider } from "@dotui/ui/components/slider";

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
