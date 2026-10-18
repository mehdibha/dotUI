import { Input } from "@/registry/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"

export function NumberFieldDemo() {
  return (
    <NumberField aria-label="Quantity" defaultValue={12}>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <Input className="w-16" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  )
}
