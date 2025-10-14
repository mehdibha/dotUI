"use client";

import { ColorSlider } from "@dotui/registry-v2/ui/color-slider";
import { Description, Label } from "@dotui/registry-v2/ui/field";

export function ColorSliderDemo() {
  return (
    <div className="flex flex-col gap-6">
      <ColorSlider channel="hue" defaultValue="hsl(200, 100%, 50%)">
        <div className="flex items-center justify-between">
          <Label>Hue</Label>
          <ColorSlider.Output />
        </div>
        <ColorSlider.Control />
        <Description>Adjust the hue of the color.</Description>
      </ColorSlider>
    </div>
  );
}
