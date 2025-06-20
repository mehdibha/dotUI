import React from "react";

import { Switch } from "@dotui/ui/components/switch";

export default function Demo() {
  return (
    <div className="flex items-center gap-10">
      <Switch>Focus mode</Switch>
      <Switch aria-label="Focus mode" />
    </div>
  );
}
