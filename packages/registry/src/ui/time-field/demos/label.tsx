import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <TimeField>
        <Label>Event time</Label>
        <DateInput />
      </TimeField>
      <TimeField aria-label="Event time" />
    </div>
  );
}
