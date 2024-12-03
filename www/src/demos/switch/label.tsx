import React from "react";
import { Switch } from "@/registry/ui/default/core/switch";

export default function Demo() {
  return (
    <div className="flex items-center gap-10">
      <Switch>Focus mode</Switch>
      <Switch aria-label="Focus mode" />
    </div>
  );
}
