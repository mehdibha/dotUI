import { Calendar } from "@/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@/registry/ui/date-picker";
import { FieldError, Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<DatePicker mode="range" aria-label="Meeting date" isInvalid>
			<Label>Meeting date</Label>
			<DatePickerInput />
			<FieldError>Meetings can't be scheduled in the past.</FieldError>
			<DatePickerContent>
				<Calendar />
			</DatePickerContent>
		</DatePicker>
	);
}
