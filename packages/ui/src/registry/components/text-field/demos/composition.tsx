import React from "react";

import { Description, Label } from "@dotui/ui/components/field";
import { TextFieldInput, TextFieldRoot } from "@dotui/ui/components/text-field";

export default function Demo() {
  return (
    <TextFieldRoot>
      <Label>Email</Label>
      <TextFieldInput />
      <Description>Enter your email.</Description>
    </TextFieldRoot>
  );
}
