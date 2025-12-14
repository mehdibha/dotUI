import { Checkbox, CheckboxIndicator } from "@dotui/registry/ui/checkbox";
import { Label } from "@dotui/registry/ui/field";

export default function Demo() {
  return (
    <Checkbox
    // appearance="card"
    >
      <CheckboxIndicator />
      <Label>I agree to the terms and conditions</Label>
    </Checkbox>
  );
}
