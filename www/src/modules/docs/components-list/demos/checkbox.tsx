import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { Label } from "@/registry/ui/field"

export function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox defaultSelected>
        <CheckboxControl />
        <Label>Accept terms</Label>
      </Checkbox>
      <Checkbox>
        <CheckboxControl />
        <Label>Subscribe to updates</Label>
      </Checkbox>
    </div>
  )
}
