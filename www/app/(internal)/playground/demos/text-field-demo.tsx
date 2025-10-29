"use client";

import { Description, Label } from "@dotui/registry-v2/ui/field";
import { Input, TextArea } from "@dotui/registry-v2/ui/input";
import { TextField } from "@dotui/registry-v2/ui/text-field";

export function TextFieldDemo() {
  return (
    <div className="grid grid-cols-2 gap-4 *:space-y-4">
      <div className="**:w-full">
        <TextField>
          <Label>Email</Label>
          <Input placeholder="hello@mehdibha.com" />
          <Description>Enter your email.</Description>
        </TextField>

        <TextField>
          <Label>Comment</Label>
          <TextArea placeholder="Type your comment here" />
          <Description>Enter your comment.</Description>
        </TextField>

        <TextField isInvalid>
          <Label>Email</Label>
          <Input placeholder="hello@mehdibha.com" className="w-full" />
        </TextField>

        <TextField isInvalid>
          <Label>Comment</Label>
          <TextArea placeholder="Type your comment here" className="w-full" />
        </TextField>
      </div>
      <div className="**:w-full">
        <TextField isDisabled>
          <Label>Disabled</Label>
          <Input placeholder="hello@mehdibha.com" className="w-full" />
          <Description>Enter your email.</Description>
        </TextField>

        <TextField isDisabled>
          <Label>Disabled</Label>
          <TextArea placeholder="Type your comment here" className="w-full" />
          <Description>Enter your comment.</Description>
        </TextField>

        <TextField isRequired>
          <Label>Email</Label>
          <Input placeholder="hello@mehdibha.com" className="w-full" />
        </TextField>

        <TextField isRequired>
          <Label>Comment</Label>
          <TextArea placeholder="Type your comment here" className="w-full" />
        </TextField>
      </div>
    </div>
  );
}
