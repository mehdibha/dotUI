"use client";

import React from "react";
import { RadioGroup, Radio } from "@/components/core/radio-group";
import { Button } from "@/components/dynamic-core/button";
import { DialogContent, DialogRoot } from "@/components/dynamic-core/dialog";
import { TextField } from "@/components/dynamic-core/text-field";
import { Heading } from "@/registry/core/heading";
import { Overlay, OverlayProps } from "@/registry/core/overlay";

type OverlayType = OverlayProps["type"];

export default function Demo() {
  const [type, setType] = React.useState<OverlayType>("modal");
  const [mobileType, setMobileType] = React.useState<OverlayType>("drawer");

  return (
    <div className="flex gap-8">
      <DialogRoot>
        <Button>Open overlay</Button>
        <Overlay type={type} mobileType={mobileType}>
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
        </Overlay>
      </DialogRoot>
      <RadioGroup
        label="Type"
        value={type}
        onChange={(val) => setType(val as OverlayType)}
      >
        <Radio value="modal">Modal</Radio>
        <Radio value="drawer">Drawer</Radio>
        <Radio value="popover">Popover</Radio>
      </RadioGroup>
      <RadioGroup
        label="Mobile Type"
        value={mobileType}
        onChange={(val) => setMobileType(val as OverlayType)}
      >
        <Radio value="modal">Modal</Radio>
        <Radio value="drawer">Drawer</Radio>
        <Radio value="popover">Popover</Radio>
      </RadioGroup>
    </div>
  );
}
