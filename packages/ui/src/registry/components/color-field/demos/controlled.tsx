"use client";

import React from "react";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";

import { ColorField } from "@dotui/ui/components/color-field";

export default function Demo() {
  const [color, setColor] = React.useState<Color | null>(parseColor("#7f007f"));
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorField label="Color" value={color} onChange={setColor} />
      <p className="text-sm text-fg-muted">
        Current color value: {color?.toString("hex")}
      </p>
    </div>
  );
}
