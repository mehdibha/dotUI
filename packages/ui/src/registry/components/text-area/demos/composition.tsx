import React from "react";

import { Description, Label } from "@dotui/ui/components/field";
import { InputRoot, TextAreaInput } from "@dotui/ui/components/input";
import { TextAreaRoot } from "@dotui/ui/components/text-area";

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
