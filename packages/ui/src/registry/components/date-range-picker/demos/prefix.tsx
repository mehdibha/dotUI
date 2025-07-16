import { DateRangePicker } from "@dotui/ui/components/date-range-picker";
import { PlaneIcon } from "@dotui/ui/icons";

export default function Demo() {
  return <DateRangePicker aria-label="Trip" prefix={<PlaneIcon />} />;
}
