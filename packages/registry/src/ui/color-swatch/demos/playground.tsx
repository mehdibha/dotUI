"use client";

import type { Control } from "@dotui/registry/playground";

import { ColorSwatch } from "../index";

interface ColorSwatchPlaygroundProps {
  color?: string;
}

export function ColorSwatchPlayground({
  color = "#ff0000",
}: ColorSwatchPlaygroundProps) {
  return <ColorSwatch color={color} />;
}

export const colorSwatchControls: Control[] = [
  {
    type: "string",
    name: "color",
    defaultValue: "#ff0000",
  },
];
