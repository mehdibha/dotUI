import { Button } from "@dotui/ui/components/button";
import { DialogContent, DialogRoot } from "@dotui/ui/components/dialog";
import { Modal } from "@dotui/ui/components/modal";

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
