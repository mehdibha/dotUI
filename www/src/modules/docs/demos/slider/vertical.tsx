import { Slider } from "@/components/dynamic-ui/slider";

export default function Demo() {
  return (
    <Slider
      defaultValue={50}
      aria-label="Opacity"
      orientation="vertical"
      className="w-8"
    />
  );
}
