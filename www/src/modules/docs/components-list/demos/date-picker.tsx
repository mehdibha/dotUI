import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { DatePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { Popover } from "@/registry/ui/popover";

export function DatePickerDemo() {
	return (
		<DatePicker className="w-56" aria-label="Date">
			<InputGroup>
				<DateInput />
				<InputGroupAddon>
					<Button variant="default" size="sm" isIconOnly>
						<CalendarIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<Popover>
				<DialogContent className="in-popover:p-0">
					<Calendar className="mx-auto" />
				</DialogContent>
			</Popover>
		</DatePicker>
	);
}
