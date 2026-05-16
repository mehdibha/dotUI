import { useState } from "react";

import { CheckIcon, SlidersHorizontalIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { ColorEditor } from "@/registry/ui/color-editor";
import { ColorPicker } from "@/registry/ui/color-picker";
import { ColorSwatch } from "@/registry/ui/color-swatch";
import { DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { Select, SelectTrigger } from "@/registry/ui/select";

const colorPresets = [
	{ name: "Neutral", value: "neutral", colors: ["#737373", "#a3a3a3", "#d4d4d4"] },
	{ name: "Slate", value: "slate", colors: ["#475569", "#94a3b8", "#cbd5e1"] },
	{ name: "Zinc", value: "zinc", colors: ["#52525b", "#a1a1aa", "#d4d4d8"] },
	{ name: "Stone", value: "stone", colors: ["#78716c", "#a8a29e", "#d6d3d1"] },
];

const accentPresets = [
	{ name: "Blue", value: "blue", color: "#3b82f6" },
	{ name: "Violet", value: "violet", color: "#8b5cf6" },
	{ name: "Green", value: "green", color: "#22c55e" },
	{ name: "Orange", value: "orange", color: "#f97316" },
	{ name: "Rose", value: "rose", color: "#f43f5e" },
	{ name: "Cyan", value: "cyan", color: "#06b6d4" },
	{ name: "Yellow", value: "yellow", color: "#eab308" },
	{ name: "Teal", value: "teal", color: "#14b8a6" },
];

export function ColorsConfig() {
	const [isAdvanced, setIsAdvanced] = useState(false);
	const [basePreset, setBasePreset] = useState("neutral");
	const [accentPreset, setAccentPreset] = useState("blue");

	return (
		<div className="-mt-6">
			{/* Toggle basic/advanced */}
			<div className="flex items-center justify-end">
				<Button
					variant="quiet"
					size="xs"
					onClick={() => setIsAdvanced(!isAdvanced)}
					className="flex cursor-pointer items-center gap-1.5 self-start rounded-md px-1 py-0.5 text-xs text-fg-muted transition-colors hover:text-fg"
				>
					<SlidersHorizontalIcon className="size-3" />
					{isAdvanced ? "Advanced" : "Simple"}
				</Button>
			</div>
			<div className="flex flex-col gap-4">
				<Select className="w-full" defaultValue="material">
					<Label>Color system</Label>
					<SelectTrigger className="w-full" />
					<Popover>
						<ListBox>
							<ListBoxItem id="material">Material design</ListBoxItem>
						</ListBox>
					</Popover>
				</Select>

				{isAdvanced ? (
					<>
						{/* Base color presets */}
						<div className="flex flex-col gap-2">
							<span className="pl-1 text-xs font-medium text-fg-muted">Base color</span>
							<div className="grid grid-cols-2 gap-1.5">
								{colorPresets.map((preset) => (
									<button
										key={preset.value}
										type="button"
										onClick={() => setBasePreset(preset.value)}
										className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-left transition-colors hover:bg-muted ${
											basePreset === preset.value ? "border-primary bg-primary/5" : ""
										}`}
									>
										<div className="flex -space-x-1">
											{preset.colors.map((c) => (
												<div key={c} className="size-4 rounded-full border border-bg" style={{ background: c }} />
											))}
										</div>
										<span className="text-xs">{preset.name}</span>
										{basePreset === preset.value && <CheckIcon className="ml-auto size-3 text-primary" />}
									</button>
								))}
							</div>
						</div>

						{/* Accent color presets */}
						<div className="flex flex-col gap-2">
							<span className="pl-1 text-xs font-medium text-fg-muted">Accent color</span>
							<div className="flex flex-wrap gap-1.5">
								{accentPresets.map((preset) => (
									<button
										key={preset.value}
										type="button"
										onClick={() => setAccentPreset(preset.value)}
										className="group relative flex size-8 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-110"
										style={{ background: preset.color }}
										title={preset.name}
									>
										{accentPreset === preset.value && <CheckIcon className="size-3.5 text-white drop-shadow-sm" />}
									</button>
								))}
							</div>
						</div>

						{/* Semantic colors */}
						<div className="flex flex-col gap-2">
							<span className="pl-1 text-xs font-medium text-fg-muted">Semantic colors</span>
							<div className="grid grid-cols-3 gap-1.5">
								{[
									{ name: "Success", value: "#22c55e" },
									{ name: "Warning", value: "#f97316" },
									{ name: "Danger", value: "#f43f5e" },
								].map(({ name, value }) => (
									<ColorPicker key={name} defaultValue={value}>
										{() => (
											<>
												<div className="flex flex-col items-center gap-1.5">
													<Button size="sm" className="w-full justify-center">
														<ColorSwatch className="size-3.5 rounded-full" />
													</Button>
													<span className="text-[10px] text-fg-muted">{name}</span>
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
					</>
				) : (
					<div className="grid grid-cols-2 gap-4">
						{[
							{ name: "Base color", value: "#737373" },
							{ name: "Accent color", value: "#3b82f6" },
							{ name: "Success color", value: "#22c55e" },
							{ name: "Warning color", value: "#f97316" },
							{ name: "Danger color", value: "#f43f5e" },
						].map(({ name, value }) => (
							<ColorPicker key={name} defaultValue={value}>
								{({ color }) => (
									<>
										<div className="flex flex-col gap-2">
											<Label>{name}</Label>
											<Button className="justify-start pl-2.5">
												<ColorSwatch />
												<span className="truncate">{color.getColorName("en")}</span>
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
				)}
			</div>
		</div>
	);
}
