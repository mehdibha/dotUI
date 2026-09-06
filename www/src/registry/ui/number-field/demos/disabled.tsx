import { Description, Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"

export default function Demo() {
  return (
    <NumberField
      className="max-w-xs"
      aria-label="Width"
      defaultValue={20}
      isDisabled
    >
      <Label>Width</Label>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <Input />
        <NumberFieldIncrement />
      </NumberFieldGroup>
      <Description>Enter the desired width.</Description>
    </NumberField>
  )
}
