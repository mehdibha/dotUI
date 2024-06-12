import { CalendarIcon } from "lucide-react";
import { DateField } from "@/lib/components/core/default/date-field";

export default function Demo() {
  return (
    <div className="space-y-2">
      <DateField aria-label="Meeting date" prefix={<CalendarIcon />} />
      <DateField aria-label="Meeting date" suffix={<CalendarIcon />} />
    </div>
  );
}
