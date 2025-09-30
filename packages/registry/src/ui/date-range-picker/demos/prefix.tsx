import { PlaneIcon } from "@dotui/registry/icons";
import { DateRangePicker } from "@dotui/registry/ui/date-range-picker";

export default function Demo() {
  return <DateRangePicker aria-label="Trip" prefix={<PlaneIcon />} />;
}
