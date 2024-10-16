import React from "react";
import { Description, Label } from "@/registry/ui/default/core/field";
import { Input, InputRoot } from "@/registry/ui/default/core/input";
import { TextFieldRoot } from "@/registry/ui/default/core/text-field";

export default function Demo() {
  return (
    <TextFieldRoot>
      <Label>Email</Label>
      <InputRoot>
        <Input />
      </InputRoot>
      <Description>Enter your email.</Description>
    </TextFieldRoot>
  );
}
