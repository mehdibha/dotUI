import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { NumberField } from "@dotui/registry/ui/number-field";

export default function Page() {
  return (
    <NumberField defaultValue={10}>
      <Label>Quantity</Label>
      <Input />
    </NumberField>
  );
}
