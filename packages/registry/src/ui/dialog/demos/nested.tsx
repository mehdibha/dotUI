"use client";

import React from "react";

import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Overlay } from "@dotui/registry/ui/overlay";
import { Radio, RadioGroup } from "@dotui/registry/ui/radio-group";

type Type = "modal" | "drawer" | "popover";

export default function Demo() {
  const [type, setType] = React.useState<Type>("modal");
  return (
    <div className="flex w-full items-center gap-8">
      <Dialog>
        <Button variant="default">Dialog</Button>
        <Overlay type={type} mobileType={null}>
          <DialogContent>
            <DialogHeader>
              <DialogHeading>Dialog</DialogHeading>
            </DialogHeader>
            <Dialog>
              <Button variant="default">Nested dialog</Button>
              <Overlay type={type} mobileType={null}>
                <DialogContent>
                  <DialogHeader>
                    <DialogHeading>Nested dialog</DialogHeading>
                  </DialogHeader>
                </DialogContent>
              </Overlay>
            </Dialog>
          </DialogContent>
        </Overlay>
      </Dialog>
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
