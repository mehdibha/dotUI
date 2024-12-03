import React from "react";
import { Description, Label } from "@/components/dynamic-core/field";
import { TextAreaInput, InputRoot } from "@/components/dynamic-core/input";
import { TextFieldRoot } from "@/components/dynamic-core/text-field";

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
