import { Slider } from "@/components/dynamic-ui/slider";

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
