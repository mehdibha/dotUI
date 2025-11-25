"use client";

import { Label } from "@dotui/registry/ui/field";
import type { Control } from "@dotui/registry/playground";

import { Slider, SliderControl } from "../index";

interface SliderPlaygroundProps {
  label?: string;
  isDisabled?: boolean;
  orientation?: "horizontal" | "vertical";
}

export function SliderPlayground({
  label = "Volume",
  ...props
}: SliderPlaygroundProps) {
  return (
    <Slider defaultValue={50} {...props}>
      {label && <Label>{label}</Label>}
      <SliderControl />
    </Slider>
  );
}

export const sliderControls: Control[] = [
  {
    type: "string",
    name: "label",
    label: "Label",
    defaultValue: "Volume",
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
