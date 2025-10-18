"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import {
  Button as AriaButton,
  ButtonContext as AriaButtonContext,
  Provider,
} from "react-aria-components";

import { Button } from "@dotui/registry-v2/ui/button";
import { ButtonGroup as Group } from "@dotui/registry-v2/ui/button-group";
import { Label } from "@dotui/registry-v2/ui/field";
import { Input, InputAddon, InputGroup } from "@dotui/registry-v2/ui/input";
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
