import { Description, Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

export function TextFieldDemo() {
  return (
    <TextField
      defaultValue="hello@example.com"
      className="w-full max-w-[11.5rem]"
    >
      <Label>Email</Label>
      <Input />
      <Description>Enter your email.</Description>
    </TextField>
  )
}
