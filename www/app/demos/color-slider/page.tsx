import { ColorSlider, ColorThumb } from "@dotui/registry/ui/color-slider";

export default function Page() {
  return (
    <ColorSlider channel="hue" defaultValue="hsl(0, 100%, 50%)" className="w-64">
      <ColorThumb />
    </ColorSlider>
  );
}

