"use client";

import React from "react";
import { Button } from "@/components/dynamic-core/button";
import { DialogRoot, DialogContent } from "@/components/dynamic-core/dialog";
import { Overlay } from "@/components/dynamic-core/overlay";
import { Radio, RadioGroup } from "@/components/dynamic-core/radio-group";

type Type = "modal" | "drawer" | "popover";

export default function Demo() {
  const [type, setType] = React.useState<Type>("modal");
  const [mobileType, setMobileType] = React.useState<Type>("drawer");
  return (
    <div className="flex w-full items-center gap-8">
      <DialogRoot>
        <Button>Open</Button>
        <Overlay type={type} mobileType={mobileType}>
          <DialogContent>some content</DialogContent>
        </Overlay>
      </DialogRoot>
      <RadioGroup
        label="Type"
        value={type}
        onChange={(value) => setType(value as Type)}
      >
        <Radio value="modal">Modal</Radio>
        <Radio value="drawer">Drawer</Radio>
        <Radio value="popover">Popover</Radio>
      </RadioGroup>
      <RadioGroup
        label="Mobile type"
        value={mobileType}
        onChange={(value) => setMobileType(value as Type)}
      >
        <Radio value="modal">Modal</Radio>
        <Radio value="drawer">Drawer</Radio>
        <Radio value="popover">Popover</Radio>
      </RadioGroup>
    </div>
  );
}
