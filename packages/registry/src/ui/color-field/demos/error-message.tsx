"use client";

import { ColorField } from "@dotui/registry/ui/color-field";
import { FieldError, Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";

export default function Demo() {
  return (
    <ColorField isInvalid>
      <Label>Color</Label>
      <Input />
      <FieldError>Please fill out this field.</FieldError>
    </ColorField>
  );
}
