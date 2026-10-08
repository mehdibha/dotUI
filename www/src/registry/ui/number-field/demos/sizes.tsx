import { Input } from "@/registry/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <NumberField className="w-32" aria-label="small (sm)" defaultValue={1024}>
        <NumberFieldGroup size="sm">
          <NumberFieldDecrement />
          <Input placeholder="small (sm)" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <NumberField
        className="w-32"
        aria-label="medium (md)"
        defaultValue={1024}
      >
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <Input placeholder="medium (md)" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <NumberField className="w-32" aria-label="large (lg)" defaultValue={1024}>
        <NumberFieldGroup size="lg">
          <NumberFieldDecrement />
          <Input placeholder="large (lg)" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}
