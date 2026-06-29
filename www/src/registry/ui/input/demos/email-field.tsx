import { Description, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <TextField className="w-full max-w-xs" type="email" name="email">
      <Label>Email address</Label>
      <Input placeholder="you@example.com" />
      <Description>We'll never share your email with anyone.</Description>
    </TextField>
  )
}
