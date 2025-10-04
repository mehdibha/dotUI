import React from "react";

import { Button } from "@dotui/registry/ui/button";
import { DialogContent, DialogRoot } from "@dotui/registry/ui/dialog";
import { Overlay } from "@dotui/registry/ui/overlay";

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
