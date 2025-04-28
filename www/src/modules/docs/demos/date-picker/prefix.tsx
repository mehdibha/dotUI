import { UsersIcon } from "lucide-react";
import { DatePicker } from "@/components/dynamic-ui/date-picker";

export default function Demo() {
  return <DatePicker aria-label="Meeting date" prefix={<UsersIcon />} />;
}
