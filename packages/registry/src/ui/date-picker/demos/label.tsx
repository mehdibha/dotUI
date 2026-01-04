import { Calendar } from "@dotui/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@dotui/registry/ui/date-picker";
import { Label } from "@dotui/registry/ui/field";

export default function Demo() {
	return (
		<div className="space-y-4">
			<DatePicker>
				<Label>Meeting date</Label>
				<DatePickerInput />
				<DatePickerContent>
					<Calendar />
				</DatePickerContent>
			</DatePicker>
			<DatePicker aria-label="Meeting date">
				<DatePickerInput />
				<DatePickerContent>
					<Calendar />
				</DatePickerContent>
			</DatePicker>
		</div>
	);
}
