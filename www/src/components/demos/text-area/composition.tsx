import React from "react";
import { Description, Label } from "@/components/dynamic-core/field";
import { TextAreaInput, InputRoot } from "@/components/dynamic-core/input";
import { TextAreaRoot } from "@/components/dynamic-core/text-area";

export default function Demo() {
  return (
    <TextAreaRoot>
      <Label>Comment</Label>
      <InputRoot multiline>
        <TextAreaInput />
      </InputRoot>
      <Description>Enter your comment.</Description>
    </TextAreaRoot>
  );
}
