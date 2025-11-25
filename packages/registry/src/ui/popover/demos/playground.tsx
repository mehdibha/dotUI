"use client";

import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import type { Control } from "@dotui/registry/playground";

import { Popover } from "../index";

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

export const popoverControls: Control[] = [
  {
    type: "enum",
    name: "placement",
    label: "Placement",
    options: ["bottom", "top", "left", "right"],
    defaultValue: "bottom",
  },
];
