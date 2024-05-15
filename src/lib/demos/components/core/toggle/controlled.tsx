"use client";

import React from "react";
import { Bold } from "lucide-react";
import { ToggleButton } from "@/lib/components/core/default/toggle-button";

export default function ToggleDemo() {
  const [isSelected, setIsSelected] = React.useState(true);
  return (
    <ToggleButton
      isSelected={isSelected}
      onChange={(newVal) => setIsSelected(newVal)}
      aria-label="Toggle bold"
    >
      <Bold />
    </ToggleButton>
  );
}
