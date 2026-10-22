import { PencilIcon, Trash2Icon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { Input, TextArea } from "@/registry/ui/input"
import { Modal } from "@/registry/ui/modal"
import { TextField } from "@/registry/ui/text-field"

export function DialogsScene() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Dialog>
        <Button variant="secondary">
          <PencilIcon />
          Edit profile
        </Button>
        <Modal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                This is how others see you around the workspace.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <TextField defaultValue="Sam Rivera">
                <Label>Name</Label>
                <Input />
              </TextField>
              <TextField defaultValue="Designing calm software for busy people.">
                <Label>Bio</Label>
                <TextArea />
              </TextField>
            </DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button slot="close" variant="primary">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Modal>
      </Dialog>
      <Dialog>
        <Button variant="danger">
          <Trash2Icon />
          Delete
        </Button>
        <Modal>
          <DialogContent role="alertdialog">
            <DialogHeader>
              <DialogTitle>Delete this project?</DialogTitle>
              <DialogDescription>
                Its pages and history go with it. This can’t be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button slot="close" variant="danger">
                Delete project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Modal>
      </Dialog>
    </div>
  )
}
