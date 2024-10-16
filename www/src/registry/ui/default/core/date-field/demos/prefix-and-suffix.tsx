import { DateField } from "@/registry/ui/default/core/date-field";
import { CalendarIcon } from "@/__icons__";

export default function Demo() {
  return (
    <div className="space-y-2">
      <DateField aria-label="Meeting date" prefix={<CalendarIcon />} />
      <DateField aria-label="Meeting date" suffix={<CalendarIcon />} />
    </div>
  );
}
