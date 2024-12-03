import React from "react";
import { Description, Label } from "@/components/dynamic-core/field";
import { Input, InputRoot } from "@/components/dynamic-core/input";
import { TextFieldRoot } from "@/components/dynamic-core/text-field";

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
