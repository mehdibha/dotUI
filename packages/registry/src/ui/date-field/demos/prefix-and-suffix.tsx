import { CalendarIcon } from "@dotui/registry/icons";
import { DateField } from "@dotui/registry/ui/date-field";

export default function Demo() {
  return (
    <div className="space-y-2">
      <DateField aria-label="Meeting date" prefix={<CalendarIcon />} />
      <DateField aria-label="Meeting date" suffix={<CalendarIcon />} />
    </div>
  );
}
