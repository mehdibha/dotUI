import React from "react";
import { PenSquareIcon } from "lucide-react";
import { Button } from "@/components/dynamic-ui/button";
import {
  DialogRoot,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogInset,
} from "@/components/dynamic-ui/dialog";

export default function Demo() {
  return (
    <DialogRoot>
      <Button prefix={<PenSquareIcon />}>Create issue</Button>
      <Dialog
        title="Create a new issue"
        description="Report an issue or create a feature request."
      >
        <DialogBody>
          <DialogInset className="bg-bg-muted !my-4">
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
