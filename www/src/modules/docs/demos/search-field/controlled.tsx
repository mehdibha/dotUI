"use client";

import React from "react";
import { SearchField } from "@/components/dynamic-ui/search-field";

export default function Demo() {
  const [inputValue, setInputValue] = React.useState(
    "Is dotUI the next-gen ui lib?"
  );
  return (
    <div className="flex flex-col items-center gap-4">
      <SearchField value={inputValue} onChange={setInputValue} />
      <p className="text-fg-muted text-sm">
        mirrored search text: {inputValue}
      </p>
    </div>
  );
}
