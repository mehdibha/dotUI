import { Slider } from "@/components/dynamic-core/slider";

export default function Demo() {
  return (
    <Slider
      label="Price Range"
      valueLabel
      defaultValue={[200, 300]}
      minValue={100}
      maxValue={500}
    />
  );
}