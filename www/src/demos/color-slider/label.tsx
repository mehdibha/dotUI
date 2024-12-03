import { ColorSlider } from "@/components/dynamic-core/color-slider";

export default function Demo() {
  return (
    <ColorSlider label="Hue" channel="hue" defaultValue="hsl(200, 100%, 50%)" />
  );
}
