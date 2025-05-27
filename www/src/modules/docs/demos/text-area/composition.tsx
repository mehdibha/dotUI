import React from "react";
import { Description, Label } from "@/components/dynamic-ui/field";
import { TextAreaInput, InputRoot } from "@/components/dynamic-ui/input";
import { TextAreaRoot } from "@/components/dynamic-ui/text-area";

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
