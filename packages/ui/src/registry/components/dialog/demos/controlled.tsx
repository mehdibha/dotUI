"use client";

import React from "react";

import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";

export default function Demo() {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <DialogRoot isOpen={isOpen} onOpenChange={setOpen}>
      <Button>Open dialog</Button>
      <Dialog title="This is a heading" description="this is a description">
        content here
      </Dialog>
    </DialogRoot>
  );
}
