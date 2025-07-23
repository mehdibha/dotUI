"use client";

import React from "react";
import { Group } from "react-aria-components";

import { Button } from "@dotui/ui/components/button";
import { Description, Label } from "@dotui/ui/components/field";
import { Input, InputRoot } from "@dotui/ui/components/input";
import { NumberFieldRoot } from "@dotui/ui/components/number-field";
import { MinusIcon, PlusIcon } from "@dotui/ui/icons";

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
