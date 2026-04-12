import type { Density } from "@/modules/create/preset";

import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

export function RadiusConfig() {
	return (
		<div className="flex flex-col gap-3">
			<span className="font-medium text-fg-muted text-xs">Border radius</span>
			<div className="flex items-center gap-2">
				{[
					{ label: "None", value: "none", className: "rounded-none" },
					{ label: "SM", value: "sm", className: "rounded-sm" },
					{ label: "MD", value: "md", className: "rounded-md" },
					{ label: "LG", value: "lg", className: "rounded-lg" },
					{ label: "XL", value: "xl", className: "rounded-xl" },
				].map((opt) => (
					<button
						key={opt.value}
						type="button"
						className="flex cursor-pointer flex-col items-center gap-1.5 rounded-md p-1.5 transition-colors hover:bg-muted"
					>
						<div className={`size-8 border-2 border-fg-muted/40 ${opt.className}`} />
						<span className="text-[10px] text-fg-muted">{opt.label}</span>
					</button>
				))}
			</div>
		</div>
	);
}

const densityOptions: { id: Density; label: string }[] = [
	{ id: "compact", label: "Compact" },
	{ id: "default", label: "Default" },
	{ id: "comfortable", label: "Comfortable" },
];

export function DensityConfig({
	value,
	onChange,
}: {
	value: Density;
	onChange: (density: Density) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			<span className="font-medium text-fg-muted text-xs">Density</span>
			<ToggleButtonGroup
				selectedKeys={[value]}
				onSelectionChange={(keys) => {
					const selected = [...keys][0] as Density;
					if (selected) onChange(selected);
				}}
				selectionMode="single"
				disallowEmptySelection
			>
				{densityOptions.map((opt) => (
					<ToggleButton key={opt.id} id={opt.id} size="sm">
						{opt.label}
					</ToggleButton>
				))}
			</ToggleButtonGroup>
		</div>
	);
}
