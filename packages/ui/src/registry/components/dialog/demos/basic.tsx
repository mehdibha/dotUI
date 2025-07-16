import React from "react";

import { Button } from "@dotui/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@dotui/ui/components/dialog";
import { TextArea } from "@dotui/ui/components/text-area";
import { TextField } from "@dotui/ui/components/text-field";
import { PenSquareIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <DialogRoot>
      <Button prefix={<PenSquareIcon />}>Create issue</Button>
      <Dialog
        title="Create a new issue"
        description="Report an issue or create a feature request."
      >
        <DialogBody>
          <TextField
            aria-label="Title"
            placeholder="Title"
            autoFocus
            className="w-full"
          />
          <TextArea
            aria-label="Description"
            placeholder="description"
            className="w-full"
          />
        </DialogBody>
        <DialogFooter>
          <Button slot="close">Cancel</Button>
          <Button slot="close" variant="primary">
            Save changes
          </Button>
        </DialogFooter>
      </Dialog>
    </DialogRoot>
  );
}
