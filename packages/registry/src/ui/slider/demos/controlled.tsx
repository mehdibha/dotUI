"use client";

import React from "react";

import { Label } from "@dotui/registry/ui/field";
import { Slider, SliderControl } from "@dotui/registry/ui/slider";

export default function Demo() {
  const [value, setValue] = React.useState(50);
  return (
    <div className="flex flex-col items-center gap-4">
      <Slider value={value} onChange={(value) => setValue(value as number)}>
        <Label>Opacity</Label>
        <SliderControl />
      </Slider>
      <span className="text-sm text-fg-muted">
        Value: <span className="font-semibold text-fg">{value}</span>
      </span>
    </div>
  );
}
