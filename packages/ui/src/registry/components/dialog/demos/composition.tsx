import React from "react";

import { Button } from "@dotui/ui/components/button";
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeading,
  DialogRoot,
} from "@dotui/ui/components/dialog";
import { Overlay } from "@dotui/ui/components/overlay";
import { TextArea } from "@dotui/ui/components/text-area";
import { TextField } from "@dotui/ui/components/text-field";
import { PenSquareIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <DialogRoot>
      <Button prefix={<PenSquareIcon />}>Create issue</Button>
      <Overlay>
        <DialogContent>
          <DialogHeader>
            <DialogHeading>Create a new issue</DialogHeading>
            <DialogDescription>
              Report an issue or create a feature request.
            </DialogDescription>
          </DialogHeader>
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
        </DialogContent>
      </Overlay>
    </DialogRoot>
  );
}
