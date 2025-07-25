"use client";

import type { Color } from "react-aria-components";
import React from "react";
import { ColorField } from "@/components/dynamic-ui/color-field";
import { parseColor } from "react-aria-components";

export default function Demo() {
  const [color, setColor] = React.useState<Color | null>(parseColor("#7f007f"));
  return (
    <div className="grid grid-cols-3 gap-2 *:w-24">
      <ColorField
        label="Hue"
        colorSpace="hsl"
        channel="hue"
        value={color}
        onChange={setColor}
      />
      <ColorField
        label="Saturation"
        colorSpace="hsl"
        channel="saturation"
        value={color}
        onChange={setColor}
      />
      <ColorField
        label="Lightness"
        colorSpace="hsl"
        channel="lightness"
        value={color}
        onChange={setColor}
      />
    </div>
  );
}
