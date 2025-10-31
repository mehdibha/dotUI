import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
  return (
    <TimeField isRequired>
      <Label>Event time</Label>
      <DateInput />
    </TimeField>
  );
}
