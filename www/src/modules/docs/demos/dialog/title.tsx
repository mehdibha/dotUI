import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { Dialog, DialogRoot } from "@/components/dynamic-ui/dialog";
import { TextField } from "@/components/dynamic-ui/text-field";

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
