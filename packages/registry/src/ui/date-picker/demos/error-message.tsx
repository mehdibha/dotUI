import { Calendar } from "@dotui/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@dotui/registry/ui/date-picker";
import { FieldError, Label } from "@dotui/registry/ui/field";

export default function Demo() {
	return (
		<DatePicker aria-label="Meeting date" isInvalid>
			<Label>Meeting date</Label>
			<DatePickerInput />
			<FieldError>Meetings can't be scheduled in the past.</FieldError>
			<DatePickerContent>
				<Calendar />
			</DatePickerContent>
		</DatePicker>
	);
}
