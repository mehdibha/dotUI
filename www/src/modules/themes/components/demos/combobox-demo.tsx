"use client";

import React from "react";
import { Combobox, ComboboxItem } from "@/components/dynamic-core/combobox";

export function ComboboxDemo() {
  return (
    <div className="flex gap-4">
      <Combobox label="Basic combobox">
        <ComboboxItem id="1">Option 1</ComboboxItem>
        <ComboboxItem id="2">Option 2</ComboboxItem>
        <ComboboxItem id="3">Option 3</ComboboxItem>
      </Combobox>
    </div>
  );
}
