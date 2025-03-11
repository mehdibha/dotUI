import React from "react";
import { Button } from "@/components/dynamic-core/button";
import { DialogContent, DialogRoot } from "@/components/dynamic-core/dialog";
import { Overlay } from "@/registry/core/overlay_basic";

export default function Demo() {
  return (
    <DialogRoot>
      <Button>Open overlay</Button>
      <Overlay>
        <DialogContent>some content</DialogContent>
      </Overlay>
    </DialogRoot>
  );
}
