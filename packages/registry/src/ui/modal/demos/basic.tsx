import { Button } from "@dotui/registry/ui/button";
import { DialogContent, DialogRoot } from "@dotui/registry/ui/dialog";
import { Modal } from "@dotui/registry/ui/modal";

export default function Demo() {
  return (
    <DialogRoot>
      <Button>Open modal</Button>
      <Modal>
        <DialogContent>modal content</DialogContent>
      </Modal>
    </DialogRoot>
  );
}
