import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Sheet, SheetHandle } from "@/registry/ui/sheet"

export default function Demo() {
  return (
    <Dialog>
      <Button>Open sheet</Button>
      <Sheet>
        <DialogContent>
          <SheetHandle />
          <DialogHeader>
            <DialogTitle>Drag me down</DialogTitle>
          </DialogHeader>
          <DialogBody>Or click outside to dismiss.</DialogBody>
        </DialogContent>
      </Sheet>
    </Dialog>
  )
}
