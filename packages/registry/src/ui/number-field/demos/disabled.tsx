import { Button } from "@dotui/registry/ui/button";
import { Description } from "@dotui/registry/ui/field";
import { Group } from "@dotui/registry/ui/group";
import { Input } from "@dotui/registry/ui/input";
import { NumberField } from "@dotui/registry/ui/number-field";

export default function Demo() {
  return (
    <NumberField aria-label="Width" defaultValue={20} isDisabled>
      <Group>
        <Button slot="decrement" />
        <Input />
        <Button slot="increment" />
      </Group>
      <Description>Enter the desired width.</Description>
    </NumberField>
  );
}
