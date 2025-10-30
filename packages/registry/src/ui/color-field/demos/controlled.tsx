"use client";

import React from "react";
import { Input, parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";

import { ColorField } from "@dotui/registry/ui/color-field";
import { Label } from "@dotui/registry/ui/field";

export default function Demo() {
  const [color, setColor] = React.useState<Color | null>(parseColor("#7f007f"));

  return (
    <div className="flex flex-col items-center gap-4">
      <ColorField value={color} onChange={setColor}>
        <Label>Color</Label>
        <Input />
      </ColorField>
      <p className="text-sm text-fg-muted">
        Current color value: {color?.toString("hex")}
      </p>
    </div>
  );
}
