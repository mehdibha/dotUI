"use client";

import React from "react";
import { TextField } from "@/lib/components/core/default/text-field";

export default function InputControlledDemo() {
  const [inputValue, setInputValue] = React.useState("Hello world!");
  return (
    <div className="space-y-4">
      <TextField
        value={inputValue}
        onChange={(text) => {
          setInputValue(text);
        }}
      />
      <p>mirrored text: {inputValue}</p>
    </div>
  );
}
