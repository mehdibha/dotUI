import { DatePicker } from "@/registry/ui/default/core/date-picker";
import { UsersIcon } from "@/__icons__";

export default function Demo() {
  return <DatePicker aria-label="Meeting date" prefix={<UsersIcon />} />;
}
