"use client";

import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import {
  Dialog,
  DialogFooter,
  DialogRoot,
} from "@/components/dynamic-ui/dialog";

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
          <Button slot="close" variant="outline">
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
