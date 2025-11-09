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
import { Overlay } from "@dotui/registry/ui/overlay";

export default function Page() {
  return (
    <Dialog>
      <Button>Open Dialog</Button>
      <Overlay>
        <DialogContent>
          <DialogHeader>
            <DialogHeading>Dialog Title</DialogHeading>
            <DialogDescription>
              This is a dialog description.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p>Dialog content goes here.</p>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button slot="close" variant="primary">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Overlay>
    </Dialog>
  );
}

