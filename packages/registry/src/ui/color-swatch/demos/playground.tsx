"use client";

import { ColorSwatch } from "@dotui/registry/ui/color-swatch";

interface ColorSwatchPlaygroundProps {
  color?: string;
}

export function ColorSwatchPlayground({
  color = "#ff0000",
}: ColorSwatchPlaygroundProps) {
  return <ColorSwatch color={color} />;
}
