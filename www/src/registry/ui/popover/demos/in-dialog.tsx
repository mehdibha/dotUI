import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Overlay } from '@/registry/ui/overlay'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <Dialog>
      <Button variant="default">Open Dialog</Button>
      <Overlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Popover Example</DialogTitle>
            <DialogDescription>
              Click the button below to see the popover.
            </DialogDescription>
          </DialogHeader>
          <Dialog>
            <Button variant="default" className="w-fit">
              Open Popover
            </Button>
            <Popover placement="bottom start">
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Popover in Dialog</DialogTitle>
                  <DialogDescription>
                    This popover appears inside a dialog. Click the button to
                    open it.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Popover>
          </Dialog>
        </DialogContent>
      </Overlay>
    </Dialog>
  )
}
