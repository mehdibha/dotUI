import { PinIcon } from "@/registry/__generated__/icons";
import { ToggleButton } from "@/registry/ui/toggle-button";

export default function Demo() {
	return (
		<div className="flex items-center gap-4">
			<ToggleButton size="sm" isIconOnly aria-label="Toggle pin">
				<PinIcon className="rotate-45" />
			</ToggleButton>
			<ToggleButton size="md" isIconOnly aria-label="Toggle pin">
				<PinIcon className="rotate-45" />
			</ToggleButton>
			<ToggleButton size="lg" isIconOnly aria-label="Toggle pin">
				<PinIcon className="rotate-45" />
			</ToggleButton>
			<ToggleButton size="sm" isIconOnly className="rounded-full" aria-label="Toggle pin">
				<PinIcon className="rotate-45" />
			</ToggleButton>
			<ToggleButton size="md" isIconOnly className="rounded-full" aria-label="Toggle pin">
				<PinIcon className="rotate-45" />
			</ToggleButton>
			<ToggleButton size="lg" isIconOnly className="rounded-full" aria-label="Toggle pin">
				<PinIcon className="rotate-45" />
			</ToggleButton>
		</div>
	);
}
