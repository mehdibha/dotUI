import { PenSquareIcon } from '@/registry/__generated__/icons'
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
import { Overlay } from '@/registry/ui/overlay'

export default function Demo() {
  return (
    <Dialog>
      <Button>
        <PenSquareIcon /> Create issue
      </Button>
      <Overlay>
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
      </Overlay>
    </Dialog>
  )
}
