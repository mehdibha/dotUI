"use client";

import React from "react";
import { RadioGroup, Radio } from "@/components/core/radio-group";
import { Button } from "@/components/dynamic-core/button";
import { DialogContent, DialogRoot } from "@/components/dynamic-core/dialog";
import { Drawer } from "@/components/dynamic-core/drawer";
import { TextField } from "@/components/dynamic-core/text-field";
import { Heading } from "@/registry/core/heading";

export default function Demo() {
  const [placement, setPlacement] = React.useState("bottom");
  return (
    <div>
      <DialogRoot>
        <Button>Edit profile</Button>
        <Drawer placement={placement as "top" | "bottom" | "left" | "right"}>
          <DialogContent className="space-y-4">
            <Heading>Edit Profile</Heading>
            <TextField
              autoFocus
              label="Name"
              defaultValue="Mehdi"
              className="w-full"
            />
            <TextField
              label="Username"
              defaultValue="@mehdibha_"
              className="w-full"
            />
            <div className="flex items-center justify-end gap-2">
              <Button slot="close" variant="outline">
                Cancel
              </Button>
              <Button slot="close" variant="primary">
                Save changes
              </Button>
            </div>
          </DialogContent>
        </Drawer>
      </DialogRoot>
      <RadioGroup value={placement} onChange={setPlacement}>
        <Radio value="top">Top</Radio>
        <Radio value="left">Left</Radio>
        <Radio value="bottom">Bottom</Radio>
        <Radio value="right">Right</Radio>
      </RadioGroup>
    </div>
  );
}
