import { Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from '@/registry/ui/number-field'

export default function Demo() {
  return (
    <div className="max-w-xs space-y-4">
      <NumberField defaultValue={1024}>
        <Label>Width</Label>
        <Group>
          <NumberFieldDecrement />
          <Input placeholder="Visible label" />
          <NumberFieldIncrement />
        </Group>
      </NumberField>
      <NumberField defaultValue={1024} aria-label="Width">
        <Group>
          <NumberFieldDecrement />
          <Input placeholder="Hidden label" />
          <NumberFieldIncrement />
        </Group>
      </NumberField>
    </div>
  )
}
