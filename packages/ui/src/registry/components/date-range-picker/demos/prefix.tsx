import { PlaneIcon } from "lucide-react";

import { DateRangePicker } from "@dotui/ui/components/date-range-picker";

export default function Demo() {
  return <DateRangePicker aria-label="Trip" prefix={<PlaneIcon />} />;
}
