import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Modal } from "@/registry/ui/modal"

export default function Demo() {
  return (
    <Dialog>
      <Button>Open modal</Button>
      <Modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modal</DialogTitle>
            <DialogDescription>
              A modal blocks the page behind it until it closes.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Modal>
    </Dialog>
  )
}
