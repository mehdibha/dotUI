import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { RangeCalendar } from "@/registry/ui/calendar";
import { DateRangePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { DateInput, InputAddon, InputGroup } from "@/registry/ui/input";
import { Overlay } from "@/registry/ui/overlay";

export default function Demo() {
	return (
		<div className="space-y-4">
			<DateRangePicker>
				<Label>Meeting date</Label>
				<InputGroup>
					<DateInput slot="start" />
					<span>–</span>
					<DateInput slot="end" />
					<InputAddon>
						<Button variant="default" size="icon-sm">
							<CalendarIcon />
						</Button>
					</InputAddon>
				</InputGroup>
				<Overlay type="popover" mobileType="drawer">
					<DialogContent>
						<RangeCalendar />
					</DialogContent>
				</Overlay>
			</DateRangePicker>
			<DateRangePicker aria-label="Meeting date">
				<InputGroup>
					<DateInput slot="start" />
					<span>–</span>
					<DateInput slot="end" />
					<InputAddon>
						<Button variant="default" size="icon-sm">
							<CalendarIcon />
						</Button>
					</InputAddon>
				</InputGroup>
				<Overlay type="popover" mobileType="drawer">
					<DialogContent>
						<RangeCalendar />
					</DialogContent>
				</Overlay>
			</DateRangePicker>
		</div>
	);
}
