import { PlaneIcon } from "lucide-react";
import { DateRangePicker } from "@/lib/components/core/default/date-range-picker";

export default function Demo() {
  return <DateRangePicker aria-label="Trip" prefix={<PlaneIcon />} />;
}
