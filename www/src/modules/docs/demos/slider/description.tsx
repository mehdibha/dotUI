import { Slider } from "@/components/dynamic-ui/slider";

export default function Demo() {
  return (
    <Slider
      defaultValue={50}
      label="Opacity"
      description="Adjust the background opacity."
    />
  );
}
