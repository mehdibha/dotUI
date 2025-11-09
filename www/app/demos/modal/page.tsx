import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Modal } from "@dotui/registry/ui/modal";

export default function Page() {
  return (
    <Dialog>
      <Button>Open Modal</Button>
      <Modal>
        <DialogContent>
          <p className="p-6">This is modal content.</p>
        </DialogContent>
      </Modal>
    </Dialog>
  );
}

