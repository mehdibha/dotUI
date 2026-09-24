import { CheckIcon, XIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Modal } from "@/registry/ui/modal"

export default function Demo() {
  return (
    <Dialog>
      <Button>Edit profile</Button>
      <Modal>
        <DialogContent>
          <DialogHeader layout="bar">
            <Button slot="close" isIconOnly aria-label="Cancel">
              <XIcon />
            </Button>
            <DialogTitle>Profile</DialogTitle>
            <Button slot="close" variant="primary" isIconOnly aria-label="Done">
              <CheckIcon />
            </Button>
          </DialogHeader>
          <DialogBody>
            The title stays centered between the leading and trailing actions.
          </DialogBody>
        </DialogContent>
      </Modal>
    </Dialog>
  )
}
