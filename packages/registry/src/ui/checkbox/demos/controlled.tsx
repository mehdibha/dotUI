"use client";

import React from "react";

import { Checkbox } from "@dotui/registry/ui/checkbox";

export default function Demo() {
  const [checked, setChecked] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <Checkbox isSelected={checked} onChange={setChecked}>
        I accept the terms and conditions
      </Checkbox>
      <p className="text-fg-muted text-xs">
        <span className="font-bold">Checked:</span> {checked ? "true" : "false"}
      </p>
    </div>
  );
}
