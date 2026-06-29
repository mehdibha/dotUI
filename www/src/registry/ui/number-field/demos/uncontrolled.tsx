import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from '@/registry/ui/number-field'

export default function Demo() {
  return (
    <NumberField className="max-w-xs" aria-label="Width" defaultValue={80}>
      <Group>
        <NumberFieldDecrement />
        <Input />
        <NumberFieldIncrement />
      </Group>
    </NumberField>
  )
}
