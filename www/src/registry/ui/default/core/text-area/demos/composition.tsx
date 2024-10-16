import React from "react";
import { Description, Label } from "@/registry/ui/default/core/field";
import { TextAreaInput, InputRoot } from "@/registry/ui/default/core/input";
import { TextFieldRoot } from "@/registry/ui/default/core/text-field";

export default function Demo() {
  return (
    <TextFieldRoot>
      <Label>Comment</Label>
      <InputRoot multiline>
        <TextAreaInput />
      </InputRoot>
      <Description>Enter your comment.</Description>
    </TextFieldRoot>
  );
}
