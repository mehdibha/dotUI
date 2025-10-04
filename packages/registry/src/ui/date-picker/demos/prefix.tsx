import { UsersIcon } from "@dotui/registry/icons";
import { DatePicker } from "@dotui/registry/ui/date-picker";

export default function Demo() {
  return <DatePicker aria-label="Meeting date" prefix={<UsersIcon />} />;
}
