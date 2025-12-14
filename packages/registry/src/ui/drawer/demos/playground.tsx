"use client";

import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Drawer } from "@dotui/registry/ui/drawer";

interface DrawerPlaygroundProps {
  placement?: "bottom" | "top" | "left" | "right";
}

export function DrawerPlayground({
  placement = "bottom",
}: DrawerPlaygroundProps) {
  return (
    <Dialog>
      <Button>Open Drawer</Button>
      <Drawer placement={placement}>
        <DialogContent>
          <DialogHeader>
            <DialogHeading>Drawer Title</DialogHeading>
            <DialogDescription>This is a drawer description.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p>Drawer content goes here.</p>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Drawer>
    </Dialog>
  );
}
