import { Label, Description } from "@/components/dynamic-core/field";
import {
  TimeFieldRoot,
  TimeFieldInput,
} from "@/components/dynamic-core/time-field";
import { FieldError } from "@/registry/core/field_basic";

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
