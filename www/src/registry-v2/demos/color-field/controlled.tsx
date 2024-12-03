"use client";

import React from "react";
import { type Color, parseColor } from "react-aria-components";
import { ColorField } from "@/components/dynamic-core/color-field";

export default function Demo() {
  const [color, setColor] = React.useState<Color | null>(parseColor("#7f007f"));
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorField value={color} onChange={setColor} />
      <p className="text-fg-muted text-sm">
        Current color value: {color?.toString("hex")}
      </p>
    </div>
  );
}
