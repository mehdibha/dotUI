import { Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <TextField isRequired>
      <Label>Description</Label>
      <TextArea placeholder="Type your message here" />
    </TextField>
  )
}
