"use client";

import { Label } from "@dotui/registry/ui/field";
import {
  ColorSlider,
  ColorSliderControl,
} from "@dotui/registry/ui/color-slider";

interface ColorSliderPlaygroundProps {
  channel?: "hue" | "saturation" | "lightness" | "alpha";
  orientation?: "horizontal" | "vertical";
  isDisabled?: boolean;
}

export function ColorSliderPlayground({
  channel = "hue",
  orientation = "horizontal",
  isDisabled = false,
}: ColorSliderPlaygroundProps) {
  return (
    <ColorSlider
      defaultValue="hsl(0, 100%, 50%)"
      channel={channel}
      orientation={orientation}
      isDisabled={isDisabled}
    >
      <Label>{channel}</Label>
      <ColorSliderControl />
    </ColorSlider>
  );
}
