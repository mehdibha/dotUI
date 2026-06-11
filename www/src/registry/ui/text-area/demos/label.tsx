import { Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <div className="space-y-4">
      <TextField>
        <Label>Description</Label>
        <TextArea />
      </TextField>
      <TextField aria-label="Description">
        <TextArea />
      </TextField>
    </div>
  )
}
