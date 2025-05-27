import { Label, Description } from "@/components/dynamic-ui/field";
import { FieldError } from "@/components/dynamic-ui/field";
import {
  TimeFieldRoot,
  TimeFieldInput,
} from "@/components/dynamic-ui/time-field";

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
