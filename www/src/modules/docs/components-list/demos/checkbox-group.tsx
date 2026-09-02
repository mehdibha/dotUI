import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { CheckboxGroup } from "@/registry/ui/checkbox-group"
import { FieldGroup, Label } from "@/registry/ui/field"

export function CheckboxGroupDemo() {
  return (
    <CheckboxGroup defaultValue={["comments", "mentions"]} className="w-36">
      <Label>Email me about</Label>
      <FieldGroup>
        <Checkbox value="comments">
          <CheckboxControl />
          <Label>Comments</Label>
        </Checkbox>
        <Checkbox value="mentions">
          <CheckboxControl />
          <Label>Mentions</Label>
        </Checkbox>
        <Checkbox value="followers">
          <CheckboxControl />
          <Label>Followers</Label>
        </Checkbox>
      </FieldGroup>
    </CheckboxGroup>
  )
}
