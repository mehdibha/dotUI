import { Description, FieldError, Label } from "@dotui/registry/ui/field";
import { TimeFieldInput, TimeFieldRoot } from "@dotui/registry/ui/time-field";

export default function Demo() {
  return (
    <TimeFieldRoot>
      <Label>Meeting time</Label>
      <TimeFieldInput />
      <Description>Please select a time between 9 AM and 5 PM.</Description>
      <FieldError />
    </TimeFieldRoot>
  );
}
