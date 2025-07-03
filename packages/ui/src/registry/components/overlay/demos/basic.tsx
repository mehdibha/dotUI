import React from "react";

import { Button } from "@dotui/ui/components/button";
import { DialogContent, DialogRoot } from "@dotui/ui/components/dialog";
import { Overlay } from "@dotui/ui/components/overlay";

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
