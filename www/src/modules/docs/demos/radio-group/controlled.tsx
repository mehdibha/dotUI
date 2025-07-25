"use client";

import React from "react";
import { Radio, RadioGroup } from "@/components/dynamic-ui/radio-group";

export default function Demo() {
  const [size, setSize] = React.useState("sm");
  return (
    <div className="flex flex-col items-center gap-4">
      <RadioGroup
        label="Size"
        value={size}
        onChange={(value) => setSize(value)}
      >
        <Radio value="sm">Small</Radio>
        <Radio value="md">Medium</Radio>
        <Radio value="lg">Large</Radio>
      </RadioGroup>
      <p className="text-fg-muted text-xs">{`You selected: ${size}`}</p>
    </div>
  );
}
