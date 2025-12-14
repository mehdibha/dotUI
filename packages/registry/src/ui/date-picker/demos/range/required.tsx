import { Calendar } from "@dotui/registry/ui/calendar";
import {
  DatePicker,
  DatePickerContent,
  DatePickerInput,
} from "@dotui/registry/ui/date-picker";
import { Label } from "@dotui/registry/ui/field";

export default function Demo() {
  return (
    <DatePicker mode="range" isRequired>
      <Label>Event date</Label>
      <DatePickerInput />
      <DatePickerContent>
        <Calendar />
      </DatePickerContent>
    </DatePicker>
  );
}
