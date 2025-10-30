import { Checkbox, CheckboxIndicator } from "@dotui/registry/ui/checkbox";
import { Label } from "@dotui/registry/ui/field";

export default function Demo() {
  return (
    <Checkbox defaultSelected isReadOnly>
      <CheckboxIndicator />
      <Label>I accept the terms and conditions</Label>
    </Checkbox>
  );
}
