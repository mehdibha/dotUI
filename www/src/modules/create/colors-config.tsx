"use client";

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme";
import { Button } from "@/registry/ui/button";
import { ColorEditor } from "@/registry/ui/color-editor";
import { ColorPicker } from "@/registry/ui/color-picker";
import { ColorSwatch } from "@/registry/ui/color-swatch";
import { DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { Popover } from "@/registry/ui/popover";

import type { PaletteSeeds } from "@/registry/theme";

import { useDesignSystem } from "./preset";

const SEED_FIELDS: ReadonlyArray<{ label: string; key: keyof PaletteSeeds }> = [
	{ label: "Base", key: "neutral" },
	{ label: "Accent", key: "accent" },
	{ label: "Success", key: "success" },
	{ label: "Warning", key: "warning" },
	{ label: "Danger", key: "danger" },
];

export function ColorsConfig() {
	const { designSystem, setColorSeed } = useDesignSystem();
	const seeds = designSystem.color?.seeds ?? DEFAULT_COLOR_CONFIG.seeds;

	return (
		<div className="-mt-6 flex flex-col gap-4">
			<p className="text-xs text-fg-muted">Pick brand + status seeds — the ramps regenerate live.</p>
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
		</div>
	);
}
