import { Button } from "@/components/dynamic-core/button";
import { DialogContent, DialogRoot } from "@/components/dynamic-core/dialog";
import { Modal } from "@/components/dynamic-core/modal";

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
