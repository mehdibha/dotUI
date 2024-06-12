import { UsersIcon } from "lucide-react";
import { DatePicker } from "@/lib/components/core/default/date-picker";

export default function Demo() {
  return <DatePicker aria-label="Meeting date" prefix={<UsersIcon />} />;
}
