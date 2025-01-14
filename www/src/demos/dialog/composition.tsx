import React from "react";
import { Button } from "@/components/dynamic-core/button";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/dynamic-core/dialog";
import { TextField } from "@/components/dynamic-core/text-field";
import { Overlay } from "@/registry/core/overlay";

export default function Demo() {
  return (
    <DialogRoot>
      <Button variant="outline">Edit username</Button>
      <Overlay type="modal">
        <DialogContent className="space-y-4">
          <DialogHeader></DialogHeader>
          <TextField
            label="Username"
            defaultValue="@mehdibha_"
            className="w-full"
          />
          <TextField
            label="Username"
            defaultValue="@mehdibha_"
            className="w-full"
          />
          <DialogFooter>
            <Button slot="close" variant="outline">
              Cancel
            </Button>
            <Button slot="close" variant="primary">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Overlay>
    </DialogRoot>
  );
}
