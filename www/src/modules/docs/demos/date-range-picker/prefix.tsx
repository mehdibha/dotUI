import { DateRangePicker } from "@/components/dynamic-ui/date-range-picker";
import { PlaneIcon } from "lucide-react";

export default function Demo() {
  return <DateRangePicker aria-label="Trip" prefix={<PlaneIcon />} />;
}
