import { PinIcon } from "@/registry/__generated__/icons";
import { ToggleButton } from "@/registry/ui/toggle-button";

export default function Demo() {
	return (
		<ToggleButton isDisabled>
			<PinIcon data-icon-start="" className="rotate-45" />
			Pin
		</ToggleButton>
	);
}
