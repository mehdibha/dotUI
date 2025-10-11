import { Checkbox } from "@dotui/registry-v2/ui/checkbox";

export function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Checkbox>Accept terms and conditions</Checkbox>
      <Checkbox>Accept terms and conditions</Checkbox>
      <span className="text-fg-muted">
        By clicking this checkbox, you agree to the terms and conditions.
      </span>
      <Checkbox isDisabled>Enable notifications</Checkbox>
      <Checkbox appearance="card">Enable notifications</Checkbox>
      <Checkbox isIndeterminate>Select all</Checkbox>
    </div>
  );
}
