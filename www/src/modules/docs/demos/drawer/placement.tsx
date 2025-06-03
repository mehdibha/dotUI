"use client";

import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { DialogContent, DialogRoot } from "@/components/dynamic-ui/dialog";
import { Drawer } from "@/components/dynamic-ui/drawer";
import { Radio, RadioGroup } from "@/components/ui/radio-group";

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
