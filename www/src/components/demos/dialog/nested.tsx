"use client";

import React from "react";
import { Button } from "@/components/dynamic-core/button";
import { DialogRoot, Dialog } from "@/components/dynamic-core/dialog";
import { Radio, RadioGroup } from "@/components/dynamic-core/radio-group";

type Type = "modal" | "drawer" | "popover";

export default function Demo() {
  const [type, setType] = React.useState<Type>("modal");
  return (
    <div className="flex w-full items-center gap-8">
      <DialogRoot>
        <Button variant="outline">Dialog</Button>
        <Dialog title="Dialog" type={type} mobileType={null}>
          <DialogRoot>
            <Button variant="outline">Nested dialog</Button>
            <Dialog
              title="Nested dialog"
              type={type}
              mobileType={null}
            ></Dialog>
          </DialogRoot>
        </Dialog>
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
    </div>
  );
}
