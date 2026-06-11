import { Description, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export function TextFieldDemo() {
  return (
    <TextField className="w-56">
      <Label>Email</Label>
      <Input placeholder="hello@example.com" />
      <Description>Enter your email.</Description>
    </TextField>
  )
}
