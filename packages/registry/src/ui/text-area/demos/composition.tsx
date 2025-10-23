

import { Description, Label } from "@dotui/registry/ui/field";
import { InputRoot, TextAreaInput } from "@dotui/registry/ui/input";
import { TextAreaRoot } from "@dotui/registry/ui/text-area";

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
