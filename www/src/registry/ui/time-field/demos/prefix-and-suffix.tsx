import { TimerIcon } from "@/registry/__generated__/icons";
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { TimeField } from "@/registry/ui/time-field";

export default function Demo() {
	return (
		<>
			<TimeField aria-label="Event time">
				<InputGroup>
					<InputGroupAddon>
						<TimerIcon />
					</InputGroupAddon>
					<DateInput />
				</InputGroup>
			</TimeField>
			<TimeField aria-label="Event time">
				<InputGroup>
					<DateInput />
					<InputGroupAddon>
						<TimerIcon />
					</InputGroupAddon>
				</InputGroup>
			</TimeField>
		</>
	);
}
