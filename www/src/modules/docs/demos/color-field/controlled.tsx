"use client";

import type { Color } from "react-aria-components";
import React from "react";
import { ColorField } from "@/components/dynamic-ui/color-field";
import { parseColor } from "react-aria-components";

export default function Demo() {
  const [color, setColor] = React.useState<Color | null>(parseColor("#7f007f"));
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorField label="Color" value={color} onChange={setColor} />
      <p className="text-fg-muted text-sm">
        Current color value: {color?.toString("hex")}
      </p>
    </div>
  );
}
