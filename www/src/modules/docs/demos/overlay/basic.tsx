import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { DialogContent, DialogRoot } from "@/components/dynamic-ui/dialog";
import { Overlay } from "@/components/dynamic-ui/overlay";

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
