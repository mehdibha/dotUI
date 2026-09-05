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
      <NumberField aria-label="small (sm)" defaultValue={1024}>
        <NumberFieldGroup>
          <NumberFieldDecrement size="sm" />
          <Input placeholder="small (sm)" size="sm" />
          <NumberFieldIncrement size="sm" />
        </NumberFieldGroup>
      </NumberField>
      <NumberField aria-label="medium (md)" defaultValue={1024}>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <Input placeholder="medium (md)" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <NumberField aria-label="large (lg)" defaultValue={1024}>
        <NumberFieldGroup>
          <NumberFieldDecrement size="lg" />
          <Input placeholder="large (lg)" size="lg" />
          <NumberFieldIncrement size="lg" />
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}
