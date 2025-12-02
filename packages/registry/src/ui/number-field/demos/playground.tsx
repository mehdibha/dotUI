"use client";

import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import type { Control } from "@dotui/registry/playground";

import { NumberField } from "../index";

interface NumberFieldPlaygroundProps {
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
}

export function NumberFieldPlayground({
  label = "Quantity",
  ...props
}: NumberFieldPlaygroundProps) {
  return (
    <NumberField defaultValue={1} {...props}>
      {label && <Label>{label}</Label>}
      <Input />
    </NumberField>
  );
}

export const numberFieldControls: Control[] = [
  {
    type: "string",
    name: "label",
    defaultValue: "Quantity",
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
  {
    type: "boolean",
    name: "isInvalid",
    defaultValue: false,
  },
];
