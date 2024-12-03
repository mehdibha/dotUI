"use client";

import React from "react";
import { Switch } from "@/registry/ui/default/core/switch";

export default function Demo() {
  const [isSelected, setSelected] = React.useState(true);
  return (
    <div className="flex flex-col items-center gap-4">
      <Switch isSelected={isSelected} onChange={setSelected}>
        Focus mode
      </Switch>
      <p className="text-fg-muted text-xs">
        You are {!isSelected && "not"} on{" "}
        <span className="font-bold">focus mode</span>.
      </p>
    </div>
  );
}
