import React from "react";
import { Button } from "@/components/dynamic-core/button";
import { DialogRoot, DialogContent } from "@/components/dynamic-core/dialog";
import { Drawer } from "@/components/dynamic-core/drawer";

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
