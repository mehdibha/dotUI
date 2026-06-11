import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <>
      <TextField>
        <Label>Email</Label>
        <Input />
      </TextField>
      <TextField aria-label="Email">
        <Input />
      </TextField>
    </>
  )
}
