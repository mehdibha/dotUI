"use client";

import React from "react";

import { TextArea } from "@dotui/ui/components/text-area";

export default function Demo() {
  const [inputValue, setInputValue] = React.useState(
    "Roses are red, violets are blue.",
  );
  return (
    <div className="flex flex-col items-center gap-4">
      <TextArea
        label="Essay"
        value={inputValue}
        onChange={(text) => {
          setInputValue(text);
        }}
      />
      <p className="text-fg-muted text-sm">mirrored text: {inputValue}</p>
    </div>
  );
}
