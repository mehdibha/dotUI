import { Slider } from "@/components/dynamic-ui/slider";

export default function Demo() {
  return (
    <Slider
      label="Price Range"
      showValueLabel
      defaultValue={[200, 300]}
      minValue={100}
      maxValue={500}
    />
  );
}
