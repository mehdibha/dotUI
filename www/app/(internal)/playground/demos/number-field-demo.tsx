"use client";

import { Button } from "@dotui/registry/ui/button";
import { Label } from "@dotui/registry/ui/field";
import { Group } from "@dotui/registry/ui/group";
import { Input } from "@dotui/registry/ui/input";
import { NumberField } from "@dotui/registry/ui/number-field";

export function NumberFieldDemo() {
  return (
    <div>
      <NumberField>
        <Label>Amount</Label>
        <Group>
          <Button slot="decrement" />
          <Input />
          <Button slot="increment" />
        </Group>
      </NumberField>
    </div>
  );
}
