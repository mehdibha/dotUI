import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Drawer, DrawerHandle } from '@/registry/ui/drawer'

export default function Demo() {
  return (
    <Dialog>
      <Button>Open drawer</Button>
      <Drawer>
        <DialogContent>
          <DrawerHandle />
          <DialogHeader>
            <DialogTitle>Drag me down</DialogTitle>
          </DialogHeader>
          <DialogBody>Or click outside to dismiss.</DialogBody>
        </DialogContent>
      </Drawer>
    </Dialog>
  )
}
