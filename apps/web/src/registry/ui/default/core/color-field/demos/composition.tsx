"use client";

import React from "react";
import { ColorFieldRoot } from "@/registry/ui/default/core/color-field";
import {
  Description,
  FieldError,
  Label,
} from "@/registry/ui/default/core/field";
import { Input, InputRoot } from "@/registry/ui/default/core/input";

export default function Demo() {
  return (
    <ColorFieldRoot>
      <Label>Background</Label>
      <InputRoot>
        <Input />
      </InputRoot>
      <Description>Enter a background color.</Description>
      <FieldError />
    </ColorFieldRoot>
  );
}
