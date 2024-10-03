import { UsersIcon } from "@/__icons__";
import { DatePicker } from "@/registry/ui/default/core/date-picker";

export default function Demo() {
  return <DatePicker aria-label="Meeting date" prefix={<UsersIcon />} />;
}
