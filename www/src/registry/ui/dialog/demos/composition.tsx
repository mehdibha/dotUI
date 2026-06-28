import { PenSquareIcon } from '@/registry/__generated__/icons'
import { Responsive } from '@/registry/lib/responsive'
import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Input, TextArea } from '@/registry/ui/input'
import { Modal } from '@/registry/ui/modal'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <Dialog>
      <Button>
        <PenSquareIcon /> Create issue
      </Button>
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new issue</DialogTitle>
                <DialogDescription>
                  Report an issue or create a feature request.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <TextField aria-label="Title" autoFocus>
                  <Input placeholder="Title" className="w-full" />
                </TextField>
                <TextArea
                  aria-label="Description"
                  placeholder="description"
                  className="w-full"
                />
              </DialogBody>
              <DialogFooter>
                <Button slot="close">Cancel</Button>
                <Button slot="close" variant="primary">
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          )
          return isMobile ? (
            <Drawer>{content}</Drawer>
          ) : (
            <Modal>{content}</Modal>
          )
        }}
      />
    </Dialog>
  )
}
