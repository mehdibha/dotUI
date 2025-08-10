import { DateField } from "@dotui/ui/components/date-field";
import { CalendarIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <div className="space-y-2">
      <DateField aria-label="Meeting date" prefix={<CalendarIcon />} />
      <DateField aria-label="Meeting date" suffix={<CalendarIcon />} />
    </div>
  );
}
