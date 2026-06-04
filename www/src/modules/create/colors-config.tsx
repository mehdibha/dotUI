"use client";

import { useMemo } from "react";

import { ChevronDownIcon } from "lucide-react";

import { DEFAULT_COLOR_CONFIG, PALETTE_ORDER, resolveColorConfig } from "@/registry/theme";
import { Button } from "@/registry/ui/button";
import { ColorEditor } from "@/registry/ui/color-editor";
import { ColorPicker } from "@/registry/ui/color-picker";
import { ColorSwatch } from "@/registry/ui/color-swatch";
import { DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { Select, SelectValue } from "@/registry/ui/select";

import type { AlgorithmId, PaletteSeeds } from "@/registry/theme";

import { useDesignSystem } from "./preset";

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
];

export function ColorsConfig() {
	const { designSystem, setColorSeed, setColorAlgorithm } = useDesignSystem();
	const config = designSystem.color ?? DEFAULT_COLOR_CONFIG;
	const seeds = config.seeds;
	const resolved = useMemo(() => resolveColorConfig(config), [config]);

	return (
		<div className="-mt-6 flex flex-col gap-4">
			<p className="text-xs text-fg-muted">Pick brand + status seeds — the ramps regenerate live.</p>

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
					<ColorPicker
						key={key}
						value={seeds[key] ?? DEFAULT_COLOR_CONFIG.seeds[key]}
						onChange={(color) => setColorSeed(key, color.toString("hex"))}
					>
						{({ color }) => (
							<>
								<div className="flex flex-col gap-2">
									<Label>{label}</Label>
									<Button className="justify-start pl-2.5">
										<ColorSwatch />
										<span className="truncate">{color.toString("hex")}</span>
									</Button>
								</div>
								<Popover>
									<DialogContent>
										<ColorEditor />
									</DialogContent>
								</Popover>
							</>
						)}
					</ColorPicker>
				))}
			</div>

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
