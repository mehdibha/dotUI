"use client";

import React from "react";
import { PenSquareIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import {
  DialogRoot,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@/components/dynamic-core/dialog";
import { Radio, RadioGroup } from "@/components/dynamic-core/radio-group";
import { TextArea } from "@/components/dynamic-core/text-area";
import { TextField } from "@/components/dynamic-core/text-field";

type Type = "modal" | "drawer" | "popover";

export default function Demo() {
  const [type, setType] = React.useState<Type>("modal");
  const [mobileType, setMobileType] = React.useState<Type>("drawer");
  return (
    <div className="flex w-full items-center gap-8">
      <DialogRoot>
        <Button prefix={<PenSquareIcon />}>Create issue</Button>
        <Dialog
          title="Create a new issue"
          description="Report an issue or create a feature request."
          type={type}
          mobileType={mobileType}
        >
          <DialogBody>
            <TextField
              aria-label="Title"
              placeholder="Title"
              autoFocus
              className="w-full"
            />
            <TextArea
              aria-label="Description"
              placeholder="description"
              className="w-full"
            />
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button slot="close" variant="primary">
              Save changes
            </Button>
          </DialogFooter>
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
