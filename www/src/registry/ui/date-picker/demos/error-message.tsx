import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { DatePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { FieldError, Label } from "@/registry/ui/field";
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	return (
		<DatePicker aria-label="Meeting date" isInvalid>
			<Label>Meeting date</Label>
			<InputGroup>
				<DateInput />
				<InputGroupAddon>
					<Button variant="default" size="sm" isIconOnly>
						<CalendarIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<FieldError>Meetings can't be scheduled in the past.</FieldError>
			<Popover>
				<DialogContent>
					<Calendar />
				</DialogContent>
			</Popover>
		</DatePicker>
	);
}
