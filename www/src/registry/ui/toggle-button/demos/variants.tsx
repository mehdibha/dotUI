import { PinIcon } from "@/registry/__generated__/icons";
import { ToggleButton } from "@/registry/ui/toggle-button";

const variants = ["default", "primary", "quiet"] as const;

export default function Demo() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			{variants.map((variant) => (
				<ToggleButton key={variant} variant={variant}>
					<PinIcon data-icon-start="" className="rotate-45" />
					{variant}
				</ToggleButton>
			))}
		</div>
	);
}
