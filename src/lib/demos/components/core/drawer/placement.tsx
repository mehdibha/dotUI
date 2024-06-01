"use client";

import * as React from "react";
import { Button } from "@/lib/components/core/default/button";
import { Drawer, DrawerRoot } from "@/lib/components/core/default/drawer";
import { Radio, RadioGroup } from "@/lib/components/core/default/radio";

type Placement = "top" | "right" | "bottom" | "left";

export default function DrawerDemo() {
  const [placement, setPlacement] = React.useState<Placement>("bottom");
  return (
    <div className="flex items-center gap-4">
      <RadioGroup
        label="Placement"
        value={placement}
        onChange={(newVal) => setPlacement(newVal as Placement)}
      >
        <Radio value="top">Top</Radio>
        <Radio value="right">Right</Radio>
        <Radio value="bottom">Bottom</Radio>
        <Radio value="left">Left</Radio>
      </RadioGroup>
      <DrawerRoot>
        <Button>Open drawer</Button>
        <Drawer title="Drawer title" placement={placement}>
          <div>content here</div>
        </Drawer>
      </DrawerRoot>
    </div>
  );
}
