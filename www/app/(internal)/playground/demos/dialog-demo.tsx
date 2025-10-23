"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import { Dialog } from "@dotui/registry-v2/ui/dialog";
import { Label } from "@dotui/registry-v2/ui/field";
import { Input } from "@dotui/registry-v2/ui/input";
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
              <TextField>
                <Label>Name</Label>
                <Input defaultValue="mehdi" />
              </TextField>
              <TextField>
                <Label>Username</Label>
                <Input defaultValue="mehdibha" />
              </TextField>
            </Dialog.Body>
            <Dialog.Footer>
              <Button slot="close">Cancel</Button>
              <Button variant="primary">Apply</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog>
    </div>
  );
}
