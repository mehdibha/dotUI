import { CalendarIcon } from "@/registry/__generated__/icons";
import { DateField } from "@/registry/ui/date-field";
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input";

export default function Demo() {
	return (
		<>
			<DateField aria-label="Meeting date">
				<InputGroup>
					<InputGroupAddon>
						<CalendarIcon />
					</InputGroupAddon>
					<DateInput />
				</InputGroup>
			</DateField>
			<DateField aria-label="Meeting date">
				<InputGroup>
					<DateInput />
					<InputGroupAddon>
						<CalendarIcon />
					</InputGroupAddon>
				</InputGroup>
			</DateField>
		</>
	);
}
