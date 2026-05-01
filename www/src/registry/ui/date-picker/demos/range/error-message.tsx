import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { RangeCalendar } from "@/registry/ui/calendar";
import { DateRangePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { FieldError, Label } from "@/registry/ui/field";
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	return (
		<DateRangePicker aria-label="Meeting date" isInvalid>
			<Label>Meeting date</Label>
			<InputGroup>
				<DateInput slot="start" />
				<span>–</span>
				<DateInput slot="end" />
				<InputGroupAddon>
					<Button variant="default" size="sm" isIconOnly>
						<CalendarIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<FieldError>Meetings can't be scheduled in the past.</FieldError>
			<Popover>
				<DialogContent>
					<RangeCalendar />
				</DialogContent>
			</Popover>
		</DateRangePicker>
	);
}
