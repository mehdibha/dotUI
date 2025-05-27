import React from "react";
import { Description, Label } from "@/components/dynamic-ui/field";
import {
  TextFieldInput,
  TextFieldRoot,
} from "@/components/dynamic-ui/text-field";

export default function Demo() {
  return (
    <TextFieldRoot>
      <Label>Email</Label>
      <TextFieldInput />
      <Description>Enter your email.</Description>
    </TextFieldRoot>
  );
}
