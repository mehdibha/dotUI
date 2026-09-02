import { FieldGroup, Label } from "@/registry/ui/field"
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group"

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="medium" className="w-36">
      <Label>Size</Label>
      <FieldGroup>
        <Radio value="small">
          <RadioControl />
          <Label>Small</Label>
        </Radio>
        <Radio value="medium">
          <RadioControl />
          <Label>Medium</Label>
        </Radio>
        <Radio value="large">
          <RadioControl />
          <Label>Large</Label>
        </Radio>
      </FieldGroup>
    </RadioGroup>
  )
}
