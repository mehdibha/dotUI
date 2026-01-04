import { PinIcon } from "@dotui/registry/icons";
import { ToggleButton } from "@dotui/registry/ui/toggle-button";

export default function Demo() {
	return (
		<ToggleButton isDisabled aria-label="Toggle pin">
			<PinIcon className="rotate-45" />
		</ToggleButton>
	);
}
