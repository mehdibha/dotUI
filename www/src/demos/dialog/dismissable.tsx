"use client";

import React from "react";
import { PenSquareIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import {
  DialogRoot,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@/components/dynamic-core/dialog";
import { Switch } from "@/components/dynamic-core/switch";
import { TextArea } from "@/components/dynamic-core/text-area";
import { TextField } from "@/components/dynamic-core/text-field";

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
