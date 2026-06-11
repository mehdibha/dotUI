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
    <NumberField defaultValue={1024} isRequired>
      <Label>Width</Label>
      <Group>
        <NumberFieldDecrement />
        <Input />
        <NumberFieldIncrement />
      </Group>
    </NumberField>
  )
}
