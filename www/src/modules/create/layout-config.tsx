import { Description, FieldContent, FieldGroup, Label } from "@/registry/ui/field";
import { Radio, RadioControl, RadioGroup, RadioIndicator } from "@/registry/ui/radio-group";
import { Slider, SliderControl } from "@/registry/ui/slider";

import type { Density } from "@/modules/create/preset";

export const RADIUS_FACTOR_VAR = "--radius-factor";
export const DEFAULT_RADIUS_FACTOR = "1";

export function RadiusConfig({ value, onChange }: { value: string; onChange: (value: string) => void }) {
	const parsed = Number.parseFloat(value || DEFAULT_RADIUS_FACTOR);
	const numeric = Number.isFinite(parsed) ? parsed : 1;
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="text-xs font-medium text-fg-muted">Radius factor</span>
				<span className="text-xs font-medium text-fg tabular-nums">{numeric.toFixed(2)}x</span>
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

const densityOptions: { id: Density; label: string; description: string }[] = [
	{ id: "compact", label: "Compact", description: "Tight spacing for dense UIs" },
	{ id: "default", label: "Default", description: "Balanced, comfortable spacing" },
	{ id: "comfortable", label: "Comfortable", description: "Generous breathing room" },
];

export function DensityConfig({ value, onChange }: { value: Density; onChange: (density: Density) => void }) {
	return (
		<RadioGroup value={value} onChange={(v) => onChange(v as Density)} aria-label="Density">
			<FieldGroup>
				{densityOptions.map((opt) => (
					<Radio key={opt.id} value={opt.id}>
						<RadioControl>
							<RadioIndicator />
							<FieldContent>
								<Label>{opt.label}</Label>
								<Description>{opt.description}</Description>
							</FieldContent>
						</RadioControl>
					</Radio>
				))}
			</FieldGroup>
		</RadioGroup>
	);
}
