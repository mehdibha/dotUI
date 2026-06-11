import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { Label } from '@/registry/ui/field'

export default function Demo() {
  return (
    <Checkbox>
      <CheckboxControl />
      <Label>I accept the terms and conditions</Label>
    </Checkbox>
  )
}
