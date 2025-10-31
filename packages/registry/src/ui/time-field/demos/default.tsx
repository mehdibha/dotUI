import { DateInput } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
  return (
    <TimeField aria-label="Event time">
      <DateInput />
    </TimeField>
  );
}
