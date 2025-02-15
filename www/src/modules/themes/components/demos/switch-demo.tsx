import React from "react";
import { Switch } from "@/components/core/switch";

export function SwitchDemo() {
  return (
    <div className="flex gap-4">
      <Switch>Default switch</Switch>
      <Switch isSelected>Selected switch</Switch>
      <Switch isDisabled>Disabled switch</Switch>
    </div>
  );
}
