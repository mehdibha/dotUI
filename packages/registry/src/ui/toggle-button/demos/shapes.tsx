import { PinIcon } from "@dotui/registry/icons";
import { ToggleButton } from "@dotui/registry/ui/toggle-button";

export default function Demo() {
	return (
		<div className="flex items-center gap-4">
			<ToggleButton aria-label="Toggle pin">
				<PinIcon className="rotate-45" />
			</ToggleButton>
			<ToggleButton className="rounded-full" aria-label="Toggle pin">
				<PinIcon className="rotate-45" />
			</ToggleButton>
			<ToggleButton aspect="default" defaultSelected aria-label="Toggle pin">
				<PinIcon className="rotate-45" />
				Pin
			</ToggleButton>
		</div>
	);
}
