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
  DialogInset,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Modal } from '@/registry/ui/modal'

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
                <DialogInset className="my-4! bg-muted">
                  Content within the inset.
                </DialogInset>
                <p className="mt-4">Content outside the inset.</p>
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
