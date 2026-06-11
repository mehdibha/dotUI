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
import { Drawer, DrawerHandle } from '@/registry/ui/drawer'

export default function Demo() {
  return (
    <Dialog>
      <Button>Open dialog drawer</Button>
      <Drawer>
        <DialogContent showCloseButton>
          <DrawerHandle />
          <DialogHeader>
            <DialogTitle>Project settings</DialogTitle>
            <DialogDescription>
              Review the project summary before saving your changes.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="grid gap-3 text-sm">
              <div className="grid gap-1">
                <span className="font-medium">Visibility</span>
                <span className="text-fg-muted">
                  Private workspace, visible to invited members.
                </span>
              </div>
              <div className="grid gap-1">
                <span className="font-medium">Sync status</span>
                <span className="text-fg-muted">
                  Last synchronized 4 minutes ago.
                </span>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button slot="close" variant="quiet">
              Cancel
            </Button>
            <Button slot="close" variant="primary">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Drawer>
    </Dialog>
  )
}
