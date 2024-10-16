import { DateRangePicker } from "@/registry/ui/default/core/date-range-picker";
import { PlaneIcon } from "@/__icons__";

export default function Demo() {
  return <DateRangePicker aria-label="Trip" prefix={<PlaneIcon />} />;
}
