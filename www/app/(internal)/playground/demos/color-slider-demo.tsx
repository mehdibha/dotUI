"use client";

import {
  ColorSlider,
  ColorSliderControl,
  ColorSliderOutput,
} from "@dotui/registry/ui/color-slider";
import { Description, Label } from "@dotui/registry/ui/field";

export function ColorSliderDemo() {
  return (
    <div className="flex flex-col gap-6">
      <ColorSlider channel="hue" defaultValue="hsl(200, 100%, 50%)">
        <div className="flex items-center justify-between">
          <Label>Hue</Label>
          <ColorSliderOutput />
        </div>
        <ColorSliderControl />
        <Description>Adjust the hue of the color.</Description>
      </ColorSlider>
    </div>
  );
}
