"use client";

import React from "react";
import { Switch } from "@/lib/components/core/default/switch";

export default function SwitchDemo() {
  const [checked, setChecked] = React.useState(false);
  return (
    <Switch checked={checked} onCheckedChange={setChecked}>
      Airplane Mode
    </Switch>
  );
}
