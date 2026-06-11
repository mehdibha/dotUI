import { Description, Field, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'

export function FieldDemo() {
  return (
    <Field>
      <Label>Username</Label>
      <Input placeholder="Enter username" />
      <Description>Choose a unique username</Description>
    </Field>
  )
}
