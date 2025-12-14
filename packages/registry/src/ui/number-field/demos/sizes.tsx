import { Button } from "@dotui/registry/ui/button";
import { Group } from "@dotui/registry/ui/group";
import { Input } from "@dotui/registry/ui/input";
import { NumberField } from "@dotui/registry/ui/number-field";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <NumberField aria-label="small (sm)" defaultValue={1024}>
        <Group>
          <Button slot="decrement" />
          <Input placeholder="small (sm)" size="sm" />
          <Button slot="increment" />
        </Group>
      </NumberField>
      <NumberField aria-label="medium (md)" defaultValue={1024}>
        <Group>
          <Button slot="decrement" />
          <Input placeholder="medium (md)" size="md" />
          <Button slot="increment" />
        </Group>
      </NumberField>
      <NumberField aria-label="large (lg)" defaultValue={1024}>
        <Group>
          <Button slot="decrement" />
          <Input placeholder="large (lg)" size="lg" />
          <Button slot="increment" />
        </Group>
      </NumberField>
    </div>
  );
}
