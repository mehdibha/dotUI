import { ColorSlider } from "@/registry/ui/default/core/color-slider";

export default function Demo() {
  return (
    <ColorSlider
      orientation="vertical"
      channel="hue"
      defaultValue="hsl(0, 100%, 50%)"
    />
  );
}
