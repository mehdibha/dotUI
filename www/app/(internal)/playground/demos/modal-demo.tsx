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
import { Modal } from "@dotui/registry-v2/ui/modal";
import { TextField } from "@dotui/registry-v2/ui/text-field";

export function ModalDemo() {
  return (
    <div className="flex flex-col flex-wrap items-center gap-4">
      <Dialog>
        <Button>Open modal</Button>
        <Modal>
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
                <Input />
              </TextField>
              <TextField>
                <Label>Username</Label>
                <Input />
              </TextField>
            </DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button variant="primary">Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Modal>
      </Dialog>
    </div>
  );
}
