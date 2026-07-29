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
import { Modal } from '@/registry/ui/modal'

export function DialogDemo() {
  return (
    <Dialog>
      <Button>Open Dialog</Button>
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a dialog description.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p>Dialog content goes here.</p>
              </DialogBody>
              <DialogFooter>
                <Button slot="close">Cancel</Button>
                <Button slot="close" variant="primary">
                  Confirm
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
