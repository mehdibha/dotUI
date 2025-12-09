import { Calendar } from "@dotui/registry/ui/calendar";
import { DatePicker, DatePickerInput } from "@dotui/registry/ui/date-picker";
import { DialogContent } from "@dotui/registry/ui/dialog";
import { Popover } from "@dotui/registry/ui/popover";

export default function Page() {
	return (
		<div className="flex h-100 w-60 items-start justify-start">
			<DatePicker defaultOpen>
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
