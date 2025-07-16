"use client";

import React from "react";

import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { PinIcon } from "@dotui/ui/icons";

export default function Demo() {
  const [isSelected, setSelected] = React.useState(true);
  return (
    <div className="flex flex-col items-center gap-2">
      <ToggleButton
        isSelected={isSelected}
        onChange={setSelected}
        aria-label="Toggle pin"
      >
        <PinIcon className="rotate-45" />
      </ToggleButton>
      <span className="text-sm text-fg-muted">
        state: {isSelected ? "On" : "Off"}
      </span>
    </div>
  );
}
