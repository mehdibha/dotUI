import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { Overlay } from '@/registry/ui/overlay'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <Dialog>
      <Button variant="default">Edit username</Button>
      <Overlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit username</DialogTitle>
          </DialogHeader>
          <TextField defaultValue="@mehdibha" className="w-full">
            <Label>Username</Label>
            <Input className="w-full" />
          </TextField>
        </DialogContent>
      </Overlay>
    </Dialog>
  )
}
