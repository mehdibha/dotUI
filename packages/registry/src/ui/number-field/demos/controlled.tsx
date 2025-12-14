"use client";

import React from "react";

import { Button } from "@dotui/registry/ui/button";
import { Group } from "@dotui/registry/ui/group";
import { Input } from "@dotui/registry/ui/input";
import { NumberField } from "@dotui/registry/ui/number-field";

export default function Demo() {
  const [inputValue, setInputValue] = React.useState(69);
  return (
    <div className="flex flex-col items-center gap-4">
      <NumberField
        aria-label="Width"
        value={inputValue}
        onChange={(value) => {
          setInputValue(value);
        }}
      >
        <Group>
          <Button slot="decrement" />
          <Input />
          <Button slot="increment" />
        </Group>
      </NumberField>
      <p className="text-fg-muted text-sm">mirrored number: {inputValue}</p>
    </div>
  );
}
