"use client";

import { Description, Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
  return (
    <TextField>
      <Label>Email</Label>
      <Input placeholder="hello@mehdibha.com" />
      <Description>Enter your email.</Description>
    </TextField>
  );
}
