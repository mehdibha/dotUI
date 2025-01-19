import React from "react";
import { Description, Label } from "@/components/dynamic-core/field";
import { TextFieldInput, TextFieldRoot } from "@/components/dynamic-core/text-field";

export default function Demo() {
  return (
    <TextFieldRoot>
      <Label>Email</Label>
      <TextFieldInput />
      <Description>Enter your email.</Description>
    </TextFieldRoot>
  );
}
