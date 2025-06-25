import React from "react";

import { Button } from "@dotui/ui/components/button";
import { DialogContent, DialogRoot } from "@dotui/ui/components/dialog";
import { Drawer } from "@dotui/ui/components/drawer";

export default function Demo() {
  return (
    <DialogRoot>
      <Button>Open drawer</Button>
      <Drawer>
        <DialogContent>Drawer content</DialogContent>
      </Drawer>
    </DialogRoot>
  );
}
