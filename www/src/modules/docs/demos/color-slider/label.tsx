import { ColorSlider } from "@/components/dynamic-ui/color-slider";

export default function Demo() {
  return (
    <ColorSlider label="Hue" channel="hue" defaultValue="hsl(200, 100%, 50%)" />
  );
}
