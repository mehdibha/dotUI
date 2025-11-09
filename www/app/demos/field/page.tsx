import { Field, Label, Description, FieldError } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";

export default function Page() {
  return (
    <Field>
      <Label>Username</Label>
      <Input placeholder="Enter username" />
      <Description>Choose a unique username</Description>
    </Field>
  );
}

