"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry-v2/ui/dialog";
import { Label } from "@dotui/registry-v2/ui/field";
import { Input } from "@dotui/registry-v2/ui/input";
import { Overlay } from "@dotui/registry-v2/ui/overlay";
import { TextField } from "@dotui/registry-v2/ui/text-field";

export function DialogDemo() {
  return (
    <div className="flex flex-col flex-wrap items-center gap-4">
      <Dialog>
        <Button>Open dialog</Button>
        <Overlay>
          <DialogContent>
            <DialogHeader>
              <DialogHeading>Edit profile</DialogHeading>
              <DialogDescription>
                Set the dimensions for the layer.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="space-y-4">
              <TextField>
                <Label>Name</Label>
                <Input defaultValue="mehdi" />
              </TextField>
              <TextField>
                <Label>Username</Label>
                <Input defaultValue="mehdibha" />
              </TextField>
            </DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button variant="primary">Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Overlay>
      </Dialog>
    </div>
  );
}
