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
import type { Control } from "@dotui/registry/playground";

import { Modal } from "../index";

interface ModalPlaygroundProps {
  isDismissable?: boolean;
}

export function ModalPlayground({
  isDismissable = true,
}: ModalPlaygroundProps) {
  return (
    <Dialog>
      <Button>Open Modal</Button>
      <Modal isDismissable={isDismissable}>
        <DialogContent>
          <DialogHeader>
            <DialogHeading>Modal Title</DialogHeading>
            <DialogDescription>This is a modal description.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p>Modal content goes here.</p>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button slot="close" variant="primary">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Modal>
    </Dialog>
  );
}

export const modalControls: Control[] = [
  {
    type: "boolean",
    name: "isDismissable",
    defaultValue: true,
  },
];
