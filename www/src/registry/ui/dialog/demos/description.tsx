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
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { Modal } from '@/registry/ui/modal'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <Dialog>
      <Button variant="default">Edit username</Button>
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit username</DialogTitle>
                <DialogDescription>
                  Make changes to your username.
                </DialogDescription>
              </DialogHeader>
              <TextField defaultValue="@mehdibha" className="w-full">
                <Label>Username</Label>
                <Input className="w-full" />
              </TextField>
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
