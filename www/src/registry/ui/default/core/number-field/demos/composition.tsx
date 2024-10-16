import React from "react";
import { Button } from "@/registry/ui/default/core/button";
import { Description, Label } from "@/registry/ui/default/core/field";
import { Group } from "@/registry/ui/default/core/group";
import { Input, InputRoot } from "@/registry/ui/default/core/input";
import { NumberFieldRoot } from "@/registry/ui/default/core/number-field";
import { MinusIcon, PlusIcon } from "@/__icons__";

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
