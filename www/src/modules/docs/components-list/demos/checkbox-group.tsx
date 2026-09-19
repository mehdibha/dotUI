import {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
} from "@/registry/ui/checkbox"
import { CheckboxGroup } from "@/registry/ui/checkbox-group"
import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from "@/registry/ui/field"

const addons = [
  { id: "seats", label: "Extra seats", description: "$8 per user" },
  { id: "sso", label: "Single sign-on", description: "$20 per month" },
]

export function CheckboxGroupDemo() {
  return (
    <CheckboxGroup defaultValue={["seats"]} className="w-64">
      <Label>Add-ons</Label>
      <FieldGroup>
        {addons.map((addon) => (
          <Checkbox key={addon.id} value={addon.id}>
            <CheckboxControl>
              <CheckboxIndicator />
              <FieldContent>
                <Label>{addon.label}</Label>
                <Description>{addon.description}</Description>
              </FieldContent>
            </CheckboxControl>
          </Checkbox>
        ))}
      </FieldGroup>
    </CheckboxGroup>
  )
}
