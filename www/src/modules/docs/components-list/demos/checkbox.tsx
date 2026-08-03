import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { Label } from '@/registry/ui/field'

export function CheckboxDemo() {
  return (
    <Checkbox defaultSelected>
      <CheckboxControl />
      <Label>Accept terms</Label>
    </Checkbox>
  )
}
