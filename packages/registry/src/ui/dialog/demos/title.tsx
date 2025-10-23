

import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogRoot } from "@dotui/registry/ui/dialog";
import { TextField } from "@dotui/registry/ui/text-field";

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
