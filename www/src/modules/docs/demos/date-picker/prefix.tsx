import { UsersIcon } from "lucide-react";

import { DatePicker } from "@dotui/ui/components/date-picker";

export default function Demo() {
  return <DatePicker aria-label="Meeting date" prefix={<UsersIcon />} />;
}
