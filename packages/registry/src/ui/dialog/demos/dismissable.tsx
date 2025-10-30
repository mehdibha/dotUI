"use client";

import React from "react";

import { PenSquareIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Input, TextArea } from "@dotui/registry/ui/input";
import { Overlay } from "@dotui/registry/ui/overlay";
import { Switch } from "@dotui/registry/ui/switch";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
  const [isDismissable, setDismissable] = React.useState(false);
  return (
    <div className="flex items-center gap-8">
      <Dialog>
        <Button>
          <PenSquareIcon /> Create issue
        </Button>
        <Overlay isDismissable={isDismissable}>
          <DialogContent>
            <DialogHeader>
              <DialogHeading>Create a new issue</DialogHeading>
              <DialogDescription>
                Report an issue or create a feature request.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <TextField aria-label="Title" autoFocus>
                <Input placeholder="Title" className="w-full" />
              </TextField>
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
          </DialogContent>
        </Overlay>
      </Dialog>
      <Switch
        isSelected={!isDismissable}
        onChange={(isSelected) => setDismissable(!isSelected)}
      >
        Dissmissable
      </Switch>
    </div>
  );
}
