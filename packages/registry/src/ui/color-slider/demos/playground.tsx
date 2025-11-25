"use client";

import { Label } from "@dotui/registry/ui/field";
import type { Control } from "@dotui/registry/playground";

import { ColorSlider, ColorSliderControl } from "../index";

interface ColorSliderPlaygroundProps {
  channel?: "hue" | "saturation" | "brightness" | "alpha";
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
      defaultValue="#ff0000"
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
    label: "Channel",
    options: ["hue", "saturation", "brightness", "alpha"],
    defaultValue: "hue",
  },
  {
    type: "enum",
    name: "orientation",
    label: "Orientation",
    options: ["horizontal", "vertical"],
    defaultValue: "horizontal",
  },
  {
    type: "boolean",
    name: "isDisabled",
    label: "Disabled",
    defaultValue: false,
  },
];
