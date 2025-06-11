import { Button } from "@/components/dynamic-ui/button";
import { DialogContent, DialogRoot } from "@/components/dynamic-ui/dialog";
import { Modal } from "@/components/dynamic-ui/modal";

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
