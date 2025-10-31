"use client";

import React from "react";

import { PenSquareIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { FieldGroup, Label } from "@dotui/registry/ui/field";
import { Input, TextArea } from "@dotui/registry/ui/input";
import { Overlay } from "@dotui/registry/ui/overlay";
import { Radio, RadioGroup } from "@dotui/registry/ui/radio-group";
import { TextField } from "@dotui/registry/ui/text-field";

type Type = "modal" | "drawer" | "popover";

export default function Demo() {
  const [type, setType] = React.useState<Type>("modal");
  const [mobileType, setMobileType] = React.useState<Type>("drawer");
  return (
    <div className="flex w-full items-center gap-8">
      <Dialog>
        <Button>
          <PenSquareIcon /> Create issue
        </Button>
        <Overlay type={type} mobileType={mobileType}>
          <DialogContent>
            <DialogHeader>
              <DialogHeading>Create a new issue</DialogHeading>
              <DialogDescription>
                Report an issue or create a feature request.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <TextField aria-label="Title" autoFocus>
                <Input placeholder="Title" className="w-full" />
              </TextField>
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
          </DialogContent>
        </Overlay>
      </Dialog>
      <RadioGroup value={type} onChange={(value) => setType(value as Type)}>
        <Label>Type</Label>
        <FieldGroup>
          <Radio value="modal">Modal</Radio>
          <Radio value="drawer">Drawer</Radio>
          <Radio value="popover">Popover</Radio>
        </FieldGroup>
      </RadioGroup>
      <RadioGroup
        value={mobileType}
        onChange={(value) => setMobileType(value as Type)}
      >
        <Label>Mobile type</Label>
        <FieldGroup>
          <Radio value="modal">Modal</Radio>
          <Radio value="drawer">Drawer</Radio>
          <Radio value="popover">Popover</Radio>
        </FieldGroup>
      </RadioGroup>
    </div>
  );
}
