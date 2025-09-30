"use client";

import React from "react";

import { PenSquareIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@dotui/registry/ui/dialog";
import { Switch } from "@dotui/registry/ui/switch";
import { TextArea } from "@dotui/registry/ui/text-area";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
  const [isDismissable, setDismissable] = React.useState(false);
  return (
    <div className="flex items-center gap-8">
      <DialogRoot>
        <Button prefix={<PenSquareIcon />}>Create issue</Button>
        <Dialog
          isDismissable={isDismissable}
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
      <Switch
        isSelected={!isDismissable}
        onChange={(isSelected) => setDismissable(!isSelected)}
      >
        Dissmissable
      </Switch>
    </div>
  );
}
