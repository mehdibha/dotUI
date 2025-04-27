"use client";

import React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Group } from "react-aria-components";
import { Button } from "@/components/dynamic-core/button";
import { Description, Label } from "@/components/dynamic-core/field";
import { Input, InputRoot } from "@/components/dynamic-core/input";
import { NumberFieldRoot } from "@/components/dynamic-core/number-field";

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
