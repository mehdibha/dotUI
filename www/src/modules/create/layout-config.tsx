import { Slider, SliderControl } from "@/registry/ui/slider";
import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

import type { Density } from "@/modules/create/preset";

export const RADIUS_FACTOR_VAR = "--radius-factor";
export const DEFAULT_RADIUS_FACTOR = "1";

export function RadiusConfig({ value, onChange }: { value: string; onChange: (value: string) => void }) {
	const parsed = Number.parseFloat(value || DEFAULT_RADIUS_FACTOR);
	const numeric = Number.isFinite(parsed) ? parsed : 1;
	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex items-center justify-between">
				<span className="text-xs font-medium text-fg-muted">Radius</span>
				<span className="text-xs font-medium text-fg-muted tabular-nums">{numeric.toFixed(2)}x</span>
			</div>
			<Slider
				aria-label="Radius factor"
				value={numeric}
				minValue={0}
				maxValue={2}
				step={0.05}
				onChange={(v) => onChange(String(v))}
			>
				<SliderControl />
			</Slider>
		</div>
	);
}

const densityOptions: { id: Density; label: string }[] = [
	{ id: "compact", label: "Compact" },
	{ id: "default", label: "Default" },
	{ id: "comfortable", label: "Comfortable" },
];

/** Compact segmented control for density — sits inline on the customizer home. */
export function DensityConfig({ value, onChange }: { value: Density; onChange: (density: Density) => void }) {
	return (
		<ToggleButtonGroup
			aria-label="Density"
			size="sm"
			selectionMode="single"
			disallowEmptySelection
			selectedKeys={[value]}
			onSelectionChange={(keys) => {
				const next = [...keys][0];
				if (typeof next === "string") onChange(next as Density);
			}}
			className="grid w-full grid-cols-3"
		>
			{densityOptions.map((opt) => (
				<ToggleButton key={opt.id} id={opt.id} className="w-full">
					{opt.label}
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
}
