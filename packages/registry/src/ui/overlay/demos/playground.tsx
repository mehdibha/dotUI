"use client";

import type { Control } from "@dotui/registry/playground";
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

import { Overlay } from "../index";

interface OverlayPlaygroundProps {
  type?: "modal" | "popover" | "drawer";
  mobileType?: "modal" | "drawer";
}

export function OverlayPlayground({
  type = "modal",
  mobileType = "drawer",
}: OverlayPlaygroundProps) {
  return (
    <Dialog>
      <Button>Open Overlay</Button>
      <Overlay type={type} mobileType={mobileType}>
        <DialogContent>
          <DialogHeader>
            <DialogHeading>Overlay Title</DialogHeading>
            <DialogDescription>
              This overlay adapts based on screen size.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p>Overlay content goes here.</p>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Overlay>
    </Dialog>
  );
}

export const overlayControls: Control[] = [
  {
    type: "enum",
    name: "type",
    label: "Type",
    options: ["modal", "popover", "drawer"],
    defaultValue: "modal",
  },
  {
    type: "enum",
    name: "mobileType",
    label: "Mobile Type",
    options: ["modal", "drawer"],
    defaultValue: "drawer",
  },
];

