"use client";

import type { Control } from "@dotui/registry/playground";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";

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
    label: "Label",
    defaultValue: "Quantity",
  },
  {
    type: "boolean",
    name: "isDisabled",
    label: "Disabled",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isReadOnly",
    label: "Read Only",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isInvalid",
    label: "Invalid",
    defaultValue: false,
  },
];

