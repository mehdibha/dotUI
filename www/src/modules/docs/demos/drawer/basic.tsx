import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { DialogRoot, DialogContent } from "@/components/dynamic-ui/dialog";
import { Drawer } from "@/components/dynamic-ui/drawer";

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
