import React from "react";

import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import { TextField } from "@dotui/ui/components/text-field";

export default function Demo() {
  return (
    <DialogRoot>
      <Button variant="default">Edit username</Button>
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
