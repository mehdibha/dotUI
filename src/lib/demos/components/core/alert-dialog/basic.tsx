"use client";

import {
  AlertDialogRoot,
  AlertDialog,
  AlertDialogFooter,
} from "@/lib/components/core/default/alert-dialog";
import { Button } from "@/lib/components/core/default/button";

export default function AlertDialogDemo() {
  return (
    <AlertDialogRoot>
      <Button variant="danger">Delete</Button>
      <AlertDialog
        title="Delete project"
        description="This project will be deleted, along with all of its settings."
      >
        {({ close }) => (
          <AlertDialogFooter>
            <Button variant="outline" onPress={close}>
              Cancel
            </Button>
            <Button variant="danger" onPress={close}>
              Cancel
            </Button>
          </AlertDialogFooter>
        )}
      </AlertDialog>
    </AlertDialogRoot>
  );
}
