"use client";

import { FieldError, Label } from "@dotui/registry/ui/field";
import { TextArea } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
  return (
    <TextField isInvalid>
      <Label>Comment</Label>
      <TextArea />
      <FieldError>You have exceeded the comment limit for one hour.</FieldError>
    </TextField>
  );
}
