"use client";

import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
  return (
    <TextField isReadOnly defaultValue="hello@copyui.dev">
      <Label>Email</Label>
      <Input />
    </TextField>
  );
}
