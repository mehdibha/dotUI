"use client";

import React from "react";
import { Button } from "@/lib/components/core/default/button";
import {
  MenuCheckboxItem,
  MenuContent,
  MenuLabel,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/lib/components/core/default/menu";

type Checked = React.ComponentProps<typeof MenuCheckboxItem>["checked"];

export default function MenuDemo() {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuLabel>Appearance</MenuLabel>
        <MenuSeparator />
        <MenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
          Status Bar
        </MenuCheckboxItem>
        <MenuCheckboxItem checked={false} disabled>
          Side Bar
        </MenuCheckboxItem>
        <MenuCheckboxItem checked={true} disabled>
          Activity Bar
        </MenuCheckboxItem>
        <MenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
          Panel
        </MenuCheckboxItem>
      </MenuContent>
    </MenuRoot>
  );
}
