import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { CheckboxGroup } from "@/registry/ui/checkbox-group"
import { FieldGroup, Label } from "@/registry/ui/field"

export function CheckboxGroupDemo() {
  return (
    <CheckboxGroup defaultValue={["updates", "security"]} className="w-44">
      <Label>Notification Preferences</Label>
      <FieldGroup>
        <Checkbox value="updates">
          <CheckboxControl />
          <Label>Product Updates</Label>
        </Checkbox>
        <Checkbox value="security">
          <CheckboxControl />
          <Label>Security Alerts</Label>
        </Checkbox>
        <Checkbox value="marketing">
          <CheckboxControl />
          <Label>Marketing Emails</Label>
        </Checkbox>
      </FieldGroup>
    </CheckboxGroup>
  )
}
