"use client";

import React from "react";

import { ColorFieldRoot } from "@dotui/ui/components/color-field";
import { Description, FieldError, Label } from "@dotui/ui/components/field";
import { Input, InputRoot } from "@dotui/ui/components/input";

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
