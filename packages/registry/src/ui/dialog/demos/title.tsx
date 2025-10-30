import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Overlay } from "@dotui/registry/ui/overlay";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
  return (
    <Dialog>
      <Button variant="default">Edit username</Button>
      <Overlay>
        <DialogContent>
          <DialogHeader>
            <DialogHeading>Edit username</DialogHeading>
          </DialogHeader>
          <TextField defaultValue="@mehdibha_" className="w-full">
            <Label>Username</Label>
            <Input className="w-full" />
          </TextField>
        </DialogContent>
      </Overlay>
    </Dialog>
  );
}
