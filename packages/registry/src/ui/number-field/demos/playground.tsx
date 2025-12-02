"use client";

import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";

import { NumberField } from "@dotui/registry/ui/number-field";

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
