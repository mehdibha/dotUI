import { PlaneIcon } from "lucide-react";
import { DateRangePicker } from "@/components/dynamic-core/date-range-picker";

export default function Demo() {
  return <DateRangePicker aria-label="Trip" prefix={<PlaneIcon />} />;
}
