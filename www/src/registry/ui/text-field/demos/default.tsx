import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <TextField aria-label="Email">
      <Label>Email</Label>
      <Input placeholder="hello@example.com" />
    </TextField>
  )
}
