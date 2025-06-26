import { Description, FieldError, Label } from "@dotui/ui/components/field";
import { TimeFieldInput, TimeFieldRoot } from "@dotui/ui/components/time-field";

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
