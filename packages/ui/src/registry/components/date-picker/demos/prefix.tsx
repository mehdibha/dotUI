import { DatePicker } from "@dotui/ui/components/date-picker";
import { UsersIcon } from "@dotui/ui/icons";

export default function Demo() {
  return <DatePicker aria-label="Meeting date" prefix={<UsersIcon />} />;
}
