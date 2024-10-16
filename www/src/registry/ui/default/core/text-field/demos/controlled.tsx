"use client";

import React from "react";
import { TextField } from "@/registry/ui/default/core/text-field";

export default function Demo() {
  const [inputValue, setInputValue] = React.useState("Hello world!");
  return (
    <div className="flex flex-col items-center gap-4">
      <TextField
        value={inputValue}
        onChange={(text) => {
          setInputValue(text);
        }}
      />
      <p className="text-fg-muted text-sm">mirrored text: {inputValue}</p>
    </div>
  );
}
