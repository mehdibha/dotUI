import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Drawer, DrawerHandle } from "@/registry/ui/drawer"

export default function Demo() {
  return (
    <Dialog>
      <Button>Open sheet</Button>
      <Drawer snapPoints={[0.5, 1]} className="h-[calc(100dvh-3rem)]">
        <DialogContent>
          <DrawerHandle />
          <DialogHeader>
            <DialogTitle>Half, then full</DialogTitle>
          </DialogHeader>
          <DialogBody>
            Drag up to expand the sheet, down to settle or dismiss it.
          </DialogBody>
        </DialogContent>
      </Drawer>
    </Dialog>
  )
}
