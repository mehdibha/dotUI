import { Calendar } from "@dotui/registry/ui/calendar";
import {
  DatePicker,
  DatePickerContent,
  DatePickerInput,
} from "@dotui/registry/ui/date-picker";

export default function Page() {
  return (
    <div className="h-100 flex items-start">
      <DatePicker defaultOpen>
        <DatePickerInput />
        <DatePickerContent>
          <Calendar className="mx-auto" />
        </DatePickerContent>
      </DatePicker>
    </div>
  );
}
