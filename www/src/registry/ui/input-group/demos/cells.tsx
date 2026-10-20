import { Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

export default function Demo() {
  return (
    <TextField className="w-full max-w-xs">
      <Label>Website</Label>
      <InputGroup>
        <InputGroupAddon variant="cell">https://</InputGroupAddon>
        <Input placeholder="example" />
        <InputGroupAddon variant="cell">.com</InputGroupAddon>
      </InputGroup>
    </TextField>
  )
}
