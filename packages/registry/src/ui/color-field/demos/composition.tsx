"use client";

import React from "react";

import { ColorFieldRoot } from "@dotui/registry/ui/color-field";
import { Description, FieldError, Label } from "@dotui/registry/ui/field";
import { Input, InputRoot } from "@dotui/registry/ui/input";

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
