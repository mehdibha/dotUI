"use client";

import React from "react";
import { parseColor } from "react-aria-components";

import { ColorArea } from "@dotui/registry/ui/color-area";

export default function Demo() {
  const [value, setValue] = React.useState(parseColor("hsl(0, 100%, 50%)"));
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorArea
        value={value}
        onChange={setValue}
        xChannel="saturation"
        yChannel="lightness"
      />
      <p className="text-xs text-fg-muted">
        Selected color : {value.toString()}
      </p>
    </div>
  );
}
