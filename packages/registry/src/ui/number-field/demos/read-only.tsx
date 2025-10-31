import { Button } from "@dotui/registry/ui/button";
import { Group } from "@dotui/registry/ui/group";
import { Input } from "@dotui/registry/ui/input";
import { NumberField } from "@dotui/registry/ui/number-field";

export default function Demo() {
  return (
    <NumberField aria-label="Width" isReadOnly value={69}>
      <Group>
        <Button slot="decrement" />
        <Input />
        <Button slot="increment" />
      </Group>
    </NumberField>
  );
}
