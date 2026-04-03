import { Calendar } from "@/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@/registry/ui/date-picker";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<DatePicker isRequired>
			<Label>Event date</Label>
			<DatePickerInput />
			<DatePickerContent>
				<Calendar />
			</DatePickerContent>
		</DatePicker>
	);
}
