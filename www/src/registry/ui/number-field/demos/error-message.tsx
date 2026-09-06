import { FieldError, Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"

export default function Demo() {
  return (
    <NumberField className="max-w-xs" defaultValue={1024} isInvalid>
      <Label>Width</Label>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <Input />
        <NumberFieldIncrement />
      </NumberFieldGroup>
      <FieldError>Please fill out this field.</FieldError>
    </NumberField>
  )
}
