import React from "react";
import { Button } from "@/components/dynamic-core/button";
import { DialogRoot, Dialog } from "@/components/dynamic-core/dialog";
import { TextField } from "@/components/dynamic-core/text-field";

export default function Demo() {
  return (
    <DialogRoot>
      <Button variant="outline">Edit username</Button>
      <Dialog
        title="Edit username"
        description="Make changes to your username."
      >
        <TextField
          label="Username"
          defaultValue="@mehdibha_"
          className="w-full"
        />
      </Dialog>
    </DialogRoot>
  );
}
