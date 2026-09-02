import { FieldGroup, Label } from "@/registry/ui/field"
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group"

// FieldGroup is a CSS container, which zeroes its intrinsic width; lift that
// so the group shrinks to its options and centers in the card.
export function RadioGroupDemo() {
  return (
    <RadioGroup aria-label="Size" defaultValue="medium">
      <FieldGroup className="[container-type:normal]!">
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
