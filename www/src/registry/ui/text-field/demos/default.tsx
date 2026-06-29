import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <TextField className="max-w-xs" aria-label="Email">
      <Label>Email</Label>
      <Input placeholder="hello@example.com" />
    </TextField>
  )
}
