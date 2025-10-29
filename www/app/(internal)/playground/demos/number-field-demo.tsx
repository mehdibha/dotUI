"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import { Label } from "@dotui/registry-v2/ui/field";
import { Group } from "@dotui/registry-v2/ui/group";
import { Input } from "@dotui/registry-v2/ui/input";
import { NumberField } from "@dotui/registry-v2/ui/number-field";

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
