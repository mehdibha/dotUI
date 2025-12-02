"use client";

import { Label } from "@dotui/registry/ui/field";
import type { Control } from "@dotui/registry/playground";

import { ColorSlider, ColorSliderControl } from "../index";

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

export const colorSliderControls: Control[] = [
  {
    type: "enum",
    name: "channel",
    options: ["hue", "saturation", "lightness", "alpha"],
    defaultValue: "hue",
  },
  {
    type: "enum",
    name: "orientation",
    options: ["horizontal", "vertical"],
    defaultValue: "horizontal",
  },
  {
    type: "boolean",
    name: "isDisabled",
    defaultValue: false,
  },
];
