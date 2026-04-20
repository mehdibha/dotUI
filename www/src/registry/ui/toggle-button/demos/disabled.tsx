import { PinIcon } from "@/registry/__generated__/icons";
import { ToggleButton } from "@/registry/ui/toggle-button";

export default function Demo() {
	return (
		<ToggleButton isIconOnly isDisabled aria-label="Toggle pin">
			<PinIcon className="rotate-45" />
		</ToggleButton>
	);
}
