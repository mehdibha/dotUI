import { Button } from "@dotui/registry/ui/button";
import { Label } from "@dotui/registry/ui/field";
import { Group } from "@dotui/registry/ui/group";
import { Input } from "@dotui/registry/ui/input";
import { NumberField } from "@dotui/registry/ui/number-field";

export default function Page() {
  return (
    <NumberField defaultValue={10}>
      <Label>Quantity</Label>
      <Group>
        <Input className="w-16" />
        <Button slot="decrement" />
        <Button slot="increment" />
      </Group>
    </NumberField>
  );
}
