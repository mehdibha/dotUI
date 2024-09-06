import { PlaneIcon } from "@/lib/icons";
import { DateRangePicker } from "@/registry/ui/default/core/date-range-picker";

export default function Demo() {
  return <DateRangePicker aria-label="Trip" prefix={<PlaneIcon />} />;
}
