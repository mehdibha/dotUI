"use client";

import { Button } from "@dotui/registry/ui/button";
import { Overlay } from "@dotui/registry/ui/overlay";
import type { Control } from "@dotui/registry/playground";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeading,
} from "../index";

interface DialogPlaygroundProps {
  title?: string;
  description?: string;
  isDismissable?: boolean;
}

export function DialogPlayground({
  title = "Dialog Title",
  description = "This is a dialog description.",
  ...props
}: DialogPlaygroundProps) {
  return (
    <Dialog>
      <Button>Open Dialog</Button>
      <Overlay isDismissable={props.isDismissable}>
        <DialogContent>
          <DialogHeader>
            {title && <DialogHeading>{title}</DialogHeading>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <DialogBody>
            <p>Dialog content goes here.</p>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button slot="close" variant="primary">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Overlay>
    </Dialog>
  );
}

export const dialogControls: Control[] = [
  {
    type: "string",
    name: "title",
    defaultValue: "Dialog Title",
  },
  {
    type: "string",
    name: "description",
    defaultValue: "This is a dialog description.",
  },
  {
    type: "boolean",
    name: "isDismissable",
    defaultValue: true,
  },
];
