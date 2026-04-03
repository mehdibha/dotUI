import { Calendar } from "@/registry/ui/calendar";
import { DatePicker, DatePickerInput } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Popover } from "@/registry/ui/popover";

export function DatePickerDemo() {
	return (
		<div className="flex h-100 w-60 items-start justify-start">
			<DatePicker>
				<DatePickerInput />
				<Popover>
					<DialogContent className="in-popover:p-0">
						<Calendar className="mx-auto" />
					</DialogContent>
				</Popover>
			</DatePicker>
		</div>
	);
}
