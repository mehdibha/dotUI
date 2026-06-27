import { Responsive } from '@/registry/lib/responsive'
import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Modal } from '@/registry/ui/modal'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <Dialog>
      <Button variant="default">Open Dialog</Button>
      <Responsive
        render={(isMobile) => {
          const content = (
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
                        This popover appears inside a dialog. Click the button
                        to open it.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Popover>
              </Dialog>
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
