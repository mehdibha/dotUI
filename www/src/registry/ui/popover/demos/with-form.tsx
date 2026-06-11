import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { FieldGroup, Label } from '@/registry/ui/field'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <Dialog>
      <Button variant="default">Open Popover</Button>
      <Popover placement="bottom start" className="w-64">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dimensions</DialogTitle>
            <DialogDescription>
              Set the dimensions for the layer.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-4 **:data-label:w-18 **:data-textfield:flex-row">
            <TextField defaultValue="100" autoFocus>
              <Label>Width</Label>
              <InputGroup>
                <Input defaultValue="100%" />
                <InputGroupAddon>%</InputGroupAddon>
              </InputGroup>
            </TextField>
            <TextField defaultValue="25">
              <Label>Height</Label>
              <InputGroup>
                <Input />
                <InputGroupAddon>px</InputGroupAddon>
              </InputGroup>
            </TextField>
          </FieldGroup>
        </DialogContent>
      </Popover>
    </Dialog>
  )
}
