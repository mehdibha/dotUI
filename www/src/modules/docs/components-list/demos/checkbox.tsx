import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"

export function CheckboxDemo() {
  return (
    <div className="flex items-center gap-4">
      <Checkbox defaultSelected aria-label="Selected">
        <CheckboxControl />
      </Checkbox>
      <Checkbox aria-label="Unselected">
        <CheckboxControl />
      </Checkbox>
    </div>
  )
}
