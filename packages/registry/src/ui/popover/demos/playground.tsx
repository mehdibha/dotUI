"use client";

import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Popover } from "@dotui/registry/ui/popover";

interface PopoverPlaygroundProps {
  placement?: "bottom" | "top" | "left" | "right";
}

export function PopoverPlayground({
  placement = "bottom",
}: PopoverPlaygroundProps) {
  return (
    <Dialog>
      <Button>Open Popover</Button>
      <Popover placement={placement}>
        <DialogContent className="w-56">
          <DialogHeading>Popover Title</DialogHeading>
          <p className="text-fg-muted text-sm">
            This is a popover with some content. You can put any content here.
          </p>
        </DialogContent>
      </Popover>
    </Dialog>
  );
}
