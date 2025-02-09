"use client";

import React from "react";
import { type Color, parseColor } from "react-aria-components";
import { ColorPicker } from "@/components/dynamic-core/color-picker";

export default function Demo() {
  const [value, setValue] = React.useState<Color>(
    parseColor("hsl(26, 33%, 78%)")
  );

  return <ColorPicker value={value} onChange={setValue} />;
}
