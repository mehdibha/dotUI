import { PinIcon } from "lucide-react";

import { ToggleButton } from "@/registry/ui/toggle-button";

export function ToggleButtonDemo() {
	return (
		<ToggleButton size="icon" aria-label="Toggle pin" defaultSelected>
			<PinIcon className="rotate-45" />
		</ToggleButton>
	);
}
