import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { DatePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { Modal } from "@/registry/ui/modal";

export default function Demo() {
	return (
		<DatePicker aria-label="Meeting date">
			<InputGroup>
				<DateInput />
				<InputGroupAddon>
					<Button variant="default" size="sm" isIconOnly>
						<CalendarIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<Modal>
				<DialogContent>
					<Calendar />
				</DialogContent>
			</Modal>
		</DatePicker>
	);
}
