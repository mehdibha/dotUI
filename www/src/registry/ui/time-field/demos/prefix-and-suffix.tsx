import { TimerIcon } from "@/registry/__generated__/icons";
import { DateInput, InputAddon, InputGroup } from "@/registry/ui/input";
import { TimeField } from "@/registry/ui/time-field";

export default function Demo() {
	return (
		<div className="space-y-2">
			<TimeField aria-label="Event time">
				<InputGroup>
					<InputAddon>
						<TimerIcon />
					</InputAddon>
					<DateInput />
				</InputGroup>
			</TimeField>

			<TimeField aria-label="Event time">
				<InputGroup>
					<DateInput />
					<InputAddon>
						<TimerIcon />
					</InputAddon>
				</InputGroup>
			</TimeField>
		</div>
	);
}
