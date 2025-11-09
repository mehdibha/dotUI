import { Calendar } from "@dotui/registry/ui/calendar";
import {
  DatePicker,
  DatePickerContent,
  DatePickerInput,
} from "@dotui/registry/ui/date-picker";

export default function Page() {
  return (
    <DatePicker>
      <DatePickerInput />
      <DatePickerContent>
        <Calendar />
      </DatePickerContent>
    </DatePicker>
  );
}

