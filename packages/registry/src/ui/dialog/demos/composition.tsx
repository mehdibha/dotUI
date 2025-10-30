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
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
  return (
    <Dialog>
      <Button>
        <PenSquareIcon /> Create issue
      </Button>
      <Overlay>
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
  );
}
