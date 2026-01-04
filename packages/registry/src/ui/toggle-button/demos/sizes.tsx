import { PinIcon } from "@dotui/registry/icons";
import { ToggleButton } from "@dotui/registry/ui/toggle-button";

const sizes = ["sm", "md", "lg"] as const;

export default function Demo() {
	return (
		<div className="flex items-center gap-4">
			{sizes.map((size) => (
				<ToggleButton key={size} size={size} aria-label="Toggle pin">
					<PinIcon className="rotate-45" />
				</ToggleButton>
			))}
		</div>
	);
}
