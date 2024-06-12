"use client";

import React from "react";
import { Switch } from "@/lib/components/core/default/switch";

export default function SwitchDemo() {
  const [isSelected, setSelected] = React.useState(true);
  return (
    <div className="flex flex-col items-center gap-4">
      <Switch isSelected={isSelected} onChange={setSelected}>
        Airplane Mode
      </Switch>
      <p className="text-xs text-fg-muted">
        {isSelected ? (
          <>
            You are on <span className="font-bold">focus mode</span>.
          </>
        ) : (
          "You are not on focus mode."
        )}
      </p>
    </div>
  );
}
