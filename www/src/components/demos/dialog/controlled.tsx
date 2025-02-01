"use client";

import React from "react";
import { Button } from "@/components/dynamic-core/button";
import { DialogRoot, Dialog } from "@/components/dynamic-core/dialog";

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
