import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { RangeCalendar } from "@/registry/ui/calendar";
import { DateRangePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { DateInput, InputGroupAddon, InputGroup } from "@/registry/ui/input";
import { Overlay } from "@/registry/ui/overlay";

export default function Demo() {
	return (
		<DateRangePicker aria-label="Event date" isDisabled>
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
			<Overlay type="popover" mobileType="drawer">
				<DialogContent>
					<RangeCalendar />
				</DialogContent>
			</Overlay>
		</DateRangePicker>
	);
}
