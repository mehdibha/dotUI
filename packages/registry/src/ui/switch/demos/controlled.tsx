"use client";

import React from "react";

import { Label } from "@dotui/registry/ui/field";
import { Switch, SwitchIndicator } from "@dotui/registry/ui/switch";

export default function Demo() {
  const [isSelected, setSelected] = React.useState(true);
  return (
    <div className="flex flex-col items-center gap-4">
      <Switch isSelected={isSelected} onChange={setSelected}>
        <SwitchIndicator />
        <Label>Focus mode</Label>
      </Switch>
      <p className="text-xs text-fg-muted">
        You are {!isSelected && "not"} on{" "}
        <span className="font-bold">focus mode</span>.
      </p>
    </div>
  );
}
