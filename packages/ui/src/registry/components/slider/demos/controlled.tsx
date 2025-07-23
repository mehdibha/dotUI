"use client";

import React from "react";

import { Slider } from "@dotui/ui/components/slider";

export default function Demo() {
  const [value, setValue] = React.useState(50);
  return (
    <div className="flex flex-col items-center gap-4">
      <Slider
        label="Opacity"
        value={value}
        onChange={(value) => setValue(value as number)}
      />
      <span className="text-fg-muted text-sm">
        Value: <span className="text-fg font-semibold">{value}</span>
      </span>
    </div>
  );
}
