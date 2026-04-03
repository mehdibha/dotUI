import { Calendar } from "@/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@/registry/ui/date-picker";

export default function Demo() {
	return (
		<DatePicker mode="range" aria-label="Event date" isDisabled>
			<DatePickerInput />
			<DatePickerContent>
				<Calendar />
			</DatePickerContent>
		</DatePicker>
	);
}
