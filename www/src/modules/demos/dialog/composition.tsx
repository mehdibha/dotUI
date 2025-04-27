import React from "react";
import { PenSquareIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import {
  DialogRoot,
  DialogContent,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogHeading,
  DialogDescription,
} from "@/components/dynamic-core/dialog";
import { Overlay } from "@/components/dynamic-core/overlay";
import { TextArea } from "@/components/dynamic-core/text-area";
import { TextField } from "@/components/dynamic-core/text-field";

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
