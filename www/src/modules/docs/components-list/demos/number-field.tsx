import { Group } from "@/registry/ui/group"
import { Input } from "@/registry/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"

export function NumberFieldDemo() {
  return (
    <NumberField defaultValue={12}>
      <Group>
        <NumberFieldDecrement />
        <Input className="w-16" />
        <NumberFieldIncrement />
      </Group>
    </NumberField>
  )
}
