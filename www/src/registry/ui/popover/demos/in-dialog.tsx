import { Responsive } from "@/registry/lib/responsive"
import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Modal } from "@/registry/ui/modal"
import { Popover } from "@/registry/ui/popover"
import { Sheet } from "@/registry/ui/sheet"

export default function Demo() {
  return (
    <Dialog>
      <Button variant="secondary">Open Dialog</Button>
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
                <Button variant="secondary" className="w-fit">
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
          return isMobile ? <Sheet>{content}</Sheet> : <Modal>{content}</Modal>
        }}
      />
    </Dialog>
  )
}
