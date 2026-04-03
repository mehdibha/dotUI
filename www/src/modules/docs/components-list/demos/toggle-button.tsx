import { PinIcon } from "lucide-react";

import { ToggleButton } from "@/registry/ui/toggle-button";

export function ToggleButtonDemo() {
	return (
		<ToggleButton aria-label="Toggle pin" defaultSelected>
			<PinIcon className="rotate-45" />
		</ToggleButton>
	);
}
