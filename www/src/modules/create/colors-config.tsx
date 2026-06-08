"use client";

import { useMemo } from "react";

import { ChevronDownIcon } from "lucide-react";

import { DEFAULT_COLOR_CONFIG, PALETTE_ORDER, resolveColorConfig } from "@/registry/theme";
import { Button } from "@/registry/ui/button";
import { Label } from "@/registry/ui/field";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { Select, SelectValue } from "@/registry/ui/select";

import type { AlgorithmId, PaletteSeeds } from "@/registry/theme";

import { ContrastReadout } from "./color-contrast";
import { ColorKnobsControls } from "./color-knobs";
import { useDesignSystem } from "./preset";
import { SeedColorPicker } from "./seed-color-picker";

const ALGORITHMS: ReadonlyArray<{ id: AlgorithmId; label: string }> = [
	{ id: "oklch", label: "OKLCH Perceptual" },
	{ id: "tailwind", label: "Tailwind-style" },
	{ id: "material", label: "Material" },
	{ id: "contrast", label: "Contrast-locked" },
];

const SEED_FIELDS: ReadonlyArray<{ label: string; key: keyof PaletteSeeds }> = [
	{ label: "Base", key: "neutral" },
	{ label: "Accent", key: "accent" },
	{ label: "Success", key: "success" },
	{ label: "Warning", key: "warning" },
	{ label: "Danger", key: "danger" },
	{ label: "Info", key: "info" },
];

export function ColorsConfig() {
	const { designSystem, setColorSeed, setColorAlgorithm, setColorKnob } = useDesignSystem();
	const config = designSystem.color ?? DEFAULT_COLOR_CONFIG;
	const seeds = config.seeds;
	const resolved = useMemo(() => resolveColorConfig(config), [config]);

	return (
		<div className="-mt-6 flex flex-col gap-4">
			<p className="text-xs text-fg-muted">Pick seeds, switch the algorithm, and fine-tune — ramps regenerate live.</p>

			<Select
				className="w-full"
				selectedKey={config.algorithm}
				onSelectionChange={(key) => setColorAlgorithm(key as AlgorithmId)}
			>
				<Label>Algorithm</Label>
				<Button size="sm" className="w-full justify-between">
					<SelectValue className="truncate" />
					<ChevronDownIcon data-icon-end="" />
				</Button>
				<Popover>
					<ListBox>
						{ALGORITHMS.map((algorithm) => (
							<ListBoxItem key={algorithm.id} id={algorithm.id}>
								{algorithm.label}
							</ListBoxItem>
						))}
					</ListBox>
				</Popover>
			</Select>

			<div className="grid grid-cols-2 gap-4">
				{SEED_FIELDS.map(({ label, key }) => (
					<div key={key} className="flex flex-col gap-2">
						<Label>{label}</Label>
						<SeedColorPicker
							aria-label={label}
							value={seeds[key] ?? DEFAULT_COLOR_CONFIG.seeds[key] ?? "#000000"}
							onChange={(hex) => setColorSeed(key, hex)}
						/>
					</div>
				))}
			</div>

			<ColorKnobsControls
				algorithm={config.algorithm}
				knobs={config.knobs ?? {}}
				steps={resolved.steps}
				onChange={setColorKnob}
			/>

			<ContrastReadout resolved={resolved} />

			<div className="flex flex-col gap-1.5">
				<span className="pl-1 text-xs font-medium text-fg-muted">Generated ramps</span>
				{PALETTE_ORDER.map((palette) => {
					const ramp = resolved.light[palette];
					if (!ramp) return null;
					return (
						<div key={palette} className="flex overflow-hidden rounded-md" title={palette}>
							{Object.entries(ramp).map(([step, value]) => (
								<div
									key={step}
									className="h-5 flex-1"
									style={{ backgroundColor: value }}
									title={`--${palette}-${step}: ${value}`}
								/>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
}
