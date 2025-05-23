"use client";

import React from "react";
import { RadioGroup, Radio } from "@/components/core/radio-group";
import { Button } from "@/components/dynamic-core/button";
import { DialogRoot, DialogContent } from "@/components/dynamic-core/dialog";
import { Drawer } from "@/components/dynamic-core/drawer";

export default function Demo() {
  const [placement, setPlacement] = React.useState("bottom");
  return (
    <div className="flex items-center gap-12">
      <DialogRoot>
        <Button>Open drawer</Button>
        <Drawer placement={placement as "top" | "bottom" | "left" | "right"}>
          <DialogContent>Drawer content</DialogContent>
        </Drawer>
      </DialogRoot>
      <RadioGroup label="Placement" value={placement} onChange={setPlacement}>
        <Radio value="top">Top</Radio>
        <Radio value="left">Left</Radio>
        <Radio value="bottom">Bottom</Radio>
        <Radio value="right">Right</Radio>
      </RadioGroup>
    </div>
  );
}
