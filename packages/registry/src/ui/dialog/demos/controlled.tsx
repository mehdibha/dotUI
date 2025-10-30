"use client";

import React from "react";

import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Overlay } from "@dotui/registry/ui/overlay";

export default function Demo() {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <Dialog isOpen={isOpen} onOpenChange={setOpen}>
      <Button>Open dialog</Button>
      <Overlay>
        <DialogContent>
          <DialogHeader>
            <DialogHeading>This is a heading</DialogHeading>
            <DialogDescription>this is a description</DialogDescription>
          </DialogHeader>
          content here
        </DialogContent>
      </Overlay>
    </Dialog>
  );
}
