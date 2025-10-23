"use client";

import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogFooter, DialogRoot } from "@dotui/registry/ui/dialog";

export default function Demo() {
  return (
    <DialogRoot>
      <Button variant="danger">Delete project</Button>
      <Dialog
        role="alertdialog"
        title="Delete project"
        description="Are you sure you want to delete this project? This action is permanent and cannot be undone."
      >
        <DialogFooter>
          <Button slot="close" variant="default">
            Cancel
          </Button>
          <Button slot="close" variant="danger">
            Delete project
          </Button>
        </DialogFooter>
      </Dialog>
    </DialogRoot>
  );
}
