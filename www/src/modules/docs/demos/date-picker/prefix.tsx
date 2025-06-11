import { DatePicker } from "@/components/dynamic-ui/date-picker";
import { UsersIcon } from "lucide-react";

export default function Demo() {
  return <DatePicker aria-label="Meeting date" prefix={<UsersIcon />} />;
}
