import { Slider } from "@/lib/components/core/default/slider";

export default function SliderDemo() {
  return (
    <Slider
      defaultValue={50}
      label="Items to buy"
      className="w-full"
    />
  );
}
