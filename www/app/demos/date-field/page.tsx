import { DateField } from "@dotui/registry/ui/date-field";
import { DateInput } from "@dotui/registry/ui/input";
import { Label } from "@dotui/registry/ui/field";

export default function Page() {
  return (
    <DateField>
      <Label>Meeting date</Label>
      <DateInput />
    </DateField>
  );
}
