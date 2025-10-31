"use client";

import { Label } from "@dotui/registry/ui/field";
import { TextArea } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
  return (
    <TextField>
      <Label>Description</Label>
      <TextArea />
    </TextField>
  );
}
