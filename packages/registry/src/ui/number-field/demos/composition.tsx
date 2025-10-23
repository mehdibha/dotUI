"use client";

import { Group } from "react-aria-components";

import { MinusIcon, PlusIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Description, Label } from "@dotui/registry/ui/field";
import { Input, InputRoot } from "@dotui/registry/ui/input";
import { NumberFieldRoot } from "@dotui/registry/ui/number-field";

export default function Demo() {
  return (
    <NumberFieldRoot>
      <Label>Quantity</Label>
      <Group className="flex items-center gap-2">
        <Button slot="decrement" shape="square">
          <MinusIcon />
        </Button>
        <InputRoot>
          <Input />
        </InputRoot>
        <Button slot="increment" shape="square">
          <PlusIcon />
        </Button>
      </Group>
      <Description>Enter the disired quantity.</Description>
    </NumberFieldRoot>
  );
}
