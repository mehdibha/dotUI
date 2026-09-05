import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"

export default function Demo() {
  return (
    <div className="max-w-xs space-y-4">
      <NumberField defaultValue={1024}>
        <Label>Width</Label>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <Input placeholder="Visible label" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <NumberField defaultValue={1024} aria-label="Width">
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <Input placeholder="Hidden label" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}
