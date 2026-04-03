import { PinIcon } from "@/registry/__generated__/icons";
import { ToggleButton } from "@/registry/ui/toggle-button";

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
