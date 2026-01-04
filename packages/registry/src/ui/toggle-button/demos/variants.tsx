import { PinIcon } from "@dotui/registry/icons";
import { ToggleButton } from "@dotui/registry/ui/toggle-button";

const variants = ["quiet", "default"] as const;

export default function Demo() {
	return (
		<div className="flex items-center gap-4">
			{variants.map((variant) => (
				<ToggleButton key={variant} variant={variant} aria-label="Toggle pin" defaultSelected>
					<PinIcon className="rotate-45" />
				</ToggleButton>
			))}
		</div>
	);
}
