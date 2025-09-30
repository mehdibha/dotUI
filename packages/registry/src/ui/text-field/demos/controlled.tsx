"use client";

import React from "react";

import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
  const [inputValue, setInputValue] = React.useState("Hello world!");
  return (
    <div className="flex flex-col items-center gap-4">
      <TextField
        aria-label="Controlled text field"
        value={inputValue}
        onChange={(text) => {
          setInputValue(text);
        }}
      />
      <p className="text-fg-muted text-sm">mirrored text: {inputValue}</p>
    </div>
  );
}
