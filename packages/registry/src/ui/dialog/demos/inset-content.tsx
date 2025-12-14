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
  DialogInset,
} from "@dotui/registry/ui/dialog";
import { Overlay } from "@dotui/registry/ui/overlay";

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
            <DialogInset className="my-4! bg-muted">
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
        </DialogContent>
      </Overlay>
    </Dialog>
  );
}
