import { Description, Label } from "@dotui/registry/ui/field";
import { TextFieldInput, TextFieldRoot } from "@dotui/registry/ui/text-field";

export default function Demo() {
  return (
    <TextFieldRoot>
      <Label>Email</Label>
      <TextFieldInput />
      <Description>Enter your email.</Description>
    </TextFieldRoot>
  );
}
