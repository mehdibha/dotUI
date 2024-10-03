import React from "react";
import { Button } from "@/registry/ui/default/core/button";
import { DialogRoot, Dialog } from "@/registry/ui/default/core/dialog";
import { TextField } from "@/registry/ui/default/core/text-field";

export default function Demo() {
  return (
    <DialogRoot>
      <Button variant="outline">Edit username</Button>
      <Dialog title="Edit username">
        <TextField
          label="Username"
          defaultValue="@mehdibha_"
          className="w-full"
        />
      </Dialog>
    </DialogRoot>
  );
}
