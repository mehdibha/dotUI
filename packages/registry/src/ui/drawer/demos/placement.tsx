"use client";

import React from "react";

import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Drawer } from "@dotui/registry/ui/drawer";
import { FieldGroup, Label } from "@dotui/registry/ui/field";
import { Radio, RadioGroup } from "@dotui/registry/ui/radio-group";

export default function Demo() {
  const [placement, setPlacement] = React.useState("bottom");
  return (
    <div className="flex items-center gap-12">
      <Dialog>
        <Button>Open drawer</Button>
        <Drawer placement={placement as "top" | "bottom" | "left" | "right"}>
          <DialogContent>Drawer content</DialogContent>
        </Drawer>
      </Dialog>
      <RadioGroup value={placement} onChange={setPlacement}>
        <Label>Placement</Label>
        <FieldGroup>
          <Radio value="top">Top</Radio>
          <Radio value="left">Left</Radio>
          <Radio value="bottom">Bottom</Radio>
          <Radio value="right">Right</Radio>
        </FieldGroup>
      </RadioGroup>
    </div>
  );
}
