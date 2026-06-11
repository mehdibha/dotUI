import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { Description, Label } from '@/registry/ui/field'

export default function Demo() {
  return (
    <Checkbox defaultSelected>
      <CheckboxControl />
      <div className="flex flex-col gap-1">
        <Label>Accept terms and conditions</Label>
        <Description>
          By clicking this checkbox, you agree to the terms and conditions.
        </Description>
      </div>
    </Checkbox>
  )
}
