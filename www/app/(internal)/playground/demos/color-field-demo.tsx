"use client";

import { parseColor } from "react-stately";

import { ColorField } from "@dotui/registry-v2/ui/color-field";
import { Description, FieldError, Label } from "@dotui/registry-v2/ui/field";
import { Input } from "@dotui/registry-v2/ui/input";

export function ColorFieldDemo() {
  return (
    <div className="flex flex-col gap-6">
      <ColorField defaultValue={parseColor("rgb(255, 0, 0)")}>
        <Label>Color</Label>
        <Input />
      </ColorField>

      <div className="flex items-start gap-2">
        {(["sm", "md", "lg"] as const).map((size) => (
          <ColorField key={size}>
            <Label>Color</Label>
            <Input size={size} placeholder={size} />
          </ColorField>
        ))}
      </div>

      <ColorField isInvalid>
        <Label>Color</Label>
        <Input />
        <Description>Please enter a color</Description>
        <FieldError>This field is required</FieldError>
      </ColorField>

      <ColorField isRequired>
        <Label>Color</Label>
        <Input />
        <Description>Please enter a color</Description>
      </ColorField>

    </div>
  );
}
