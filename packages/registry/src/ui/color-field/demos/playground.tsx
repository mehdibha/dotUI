"use client";

import { ColorField } from "@dotui/registry/ui/color-field";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";

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
