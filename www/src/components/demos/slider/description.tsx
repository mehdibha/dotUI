import { Slider } from "@/components/dynamic-core/slider";

export default function Demo() {
  return (
    <Slider
      defaultValue={50}
      label="Opacity"
      description="Adjust the background opacity."
    />
  );
}
