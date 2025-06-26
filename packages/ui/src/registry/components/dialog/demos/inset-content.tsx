import React from "react";
import { PenSquareIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogInset,
  DialogRoot,
} from "@dotui/ui/components/dialog";

export default function Demo() {
  return (
    <DialogRoot>
      <Button prefix={<PenSquareIcon />}>Create issue</Button>
      <Dialog
        title="Create a new issue"
        description="Report an issue or create a feature request."
      >
        <DialogBody>
          <DialogInset className="!my-4 bg-bg-muted">
            Content within the inset.
          </DialogInset>
          <p className="mt-4">Content outside the inset.</p>
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
