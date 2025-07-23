"use client";

import React from "react";

import { NumberField } from "@dotui/ui/components/number-field";

export default function Demo() {
  const [inputValue, setInputValue] = React.useState(69);
  return (
    <div className="flex flex-col items-center gap-4">
      <NumberField
        aria-label="Width"
        value={inputValue}
        onChange={(value) => {
          setInputValue(value);
        }}
      />
      <p className="text-fg-muted text-sm">mirrored number: {inputValue}</p>
    </div>
  );
}
