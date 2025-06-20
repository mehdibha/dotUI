"use client";

import React from "react";
import { parseColor } from "react-aria-components";

import { ColorSlider } from "@dotui/ui/components/color-slider";

export default function Demo() {
  const [value, setValue] = React.useState(parseColor("hsl(0, 100%, 50%)"));
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorSlider value={value} onChange={setValue} channel="hue" />
      <p className="text-fg-muted text-xs">Value: {value.toString("hex")}</p>
    </div>
  );
}
