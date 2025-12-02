"use client";

import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import type { Control } from "@dotui/registry/playground";

import { ColorField } from "../index";

interface ColorFieldPlaygroundProps {
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

export function ColorFieldPlayground({
  label = "Color",
  isDisabled = false,
  isReadOnly = false,
}: ColorFieldPlaygroundProps) {
  return (
    <ColorField
      defaultValue="#ff0000"
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
    >
      {label && <Label>{label}</Label>}
      <Input />
    </ColorField>
  );
}

export const colorFieldControls: Control[] = [
  {
    type: "string",
    name: "label",
    defaultValue: "Color",
  },
  {
    type: "boolean",
    name: "isDisabled",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isReadOnly",
    defaultValue: false,
  },
];
