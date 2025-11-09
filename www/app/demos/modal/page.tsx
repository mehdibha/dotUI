import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { Modal } from "@dotui/registry/ui/modal";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Page() {
  return (
    <div className="flex items-end justify-center h-40">
      <Dialog>
        <Button>Open Modal</Button>
        <Modal>
          <DialogContent>
            <DialogHeader>
              <DialogHeading>Edit username</DialogHeading>
            </DialogHeader>
            <DialogBody>
              <TextField defaultValue="@mehdibha_" className="w-full">
                <Label>Username</Label>
                <Input />
              </TextField>
            </DialogBody>
            <DialogFooter className="flex-row! justify-end">
              <Button slot="close">Cancel</Button>
              <Button slot="close" variant="primary">
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Modal>
      </Dialog>
    </div>
  );
}
