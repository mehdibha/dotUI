"use client";

import React from "react";
import { ColorFieldRoot } from "@/components/dynamic-core/color-field";
import {
  Description,
  FieldError,
  Label,
} from "@/components/dynamic-core/field";
import { Input, InputRoot } from "@/components/dynamic-core/input";

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
