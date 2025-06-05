"use client";

import React from "react";
import { ColorArea } from "@/components/dynamic-ui/color-area";
import { parseColor } from "react-aria-components";

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
      <p className="text-fg-muted text-xs">
        Selected color : {value.toString()}
      </p>
    </div>
  );
}
