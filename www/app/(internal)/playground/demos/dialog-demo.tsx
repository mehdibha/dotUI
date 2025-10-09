"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@dotui/registry-v2/ui/dialog";
import { TextField } from "@dotui/registry-v2/ui/text-field";

export function DialogDemo() {
  return (
    <div className="flex flex-col flex-wrap items-center gap-4">
      <Dialog>
        <Button>Open dialog</Button>
        <Dialog.Overlay>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Heading>Edit profile</Dialog.Heading>
              <Dialog.Description>
                Set the dimensions for the layer.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body className="space-y-4">
              <TextField label="Name" defaultValue="mehdi" className="w-full" />
              <TextField
                label="Username"
                defaultValue="mehdibha"
                className="w-full"
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Button slot="close">Cancel</Button>
              <Button variant="primary">Apply</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog>
      <p className="text-fg-muted text-sm">
        The dialog is rendered as a modal in desktop and as a drawer on mobile.
      </p>
    </div>
  );
}
