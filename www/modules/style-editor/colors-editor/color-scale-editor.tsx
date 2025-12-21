"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@dotui/registry/ui/badge";
import { Button } from "@dotui/registry/ui/button";
import { ColorEditor } from "@dotui/registry/ui/color-editor";
import { ColorPicker, ColorPickerContent, ColorPickerTrigger } from "@dotui/registry/ui/color-picker";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogHeading } from "@dotui/registry/ui/dialog";
import { Drawer } from "@dotui/registry/ui/drawer";
import { NumberField } from "@dotui/registry/ui/number-field";
import { Slider, SliderControl } from "@dotui/registry/ui/slider";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@dotui/registry/ui/table";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

import type { ScaleId } from "@/modules/style-editor/types";
import { SCALE_STEPS } from "@/modules/style-editor/types";

// Static color data for UI shell
const STATIC_COLORS: Record<ScaleId, { colorKeys: string[]; ratios: number[] }> = {
	neutral: {
		colorKeys: ["#6b7280"],
		ratios: [1.1, 1.25, 1.5, 2, 3, 4.5, 6, 8, 10, 12, 14],
	},
	accent: {
		colorKeys: ["#3b82f6"],
		ratios: [1.1, 1.25, 1.5, 2, 3, 4.5, 6, 8, 10, 12, 14],
	},
	success: {
		colorKeys: ["#22c55e"],
		ratios: [1.1, 1.25, 1.5, 2, 3, 4.5, 6, 8, 10, 12, 14],
	},
	warning: {
		colorKeys: ["#f59e0b"],
		ratios: [1.1, 1.25, 1.5, 2, 3, 4.5, 6, 8, 10, 12, 14],
	},
	danger: {
		colorKeys: ["#ef4444"],
		ratios: [1.1, 1.25, 1.5, 2, 3, 4.5, 6, 8, 10, 12, 14],
	},
	info: {
		colorKeys: ["#06b6d4"],
		ratios: [1.1, 1.25, 1.5, 2, 3, 4.5, 6, 8, 10, 12, 14],
	},
};

export function ColorScaleEditor({ scaleId }: { scaleId: ScaleId }) {
	const data = STATIC_COLORS[scaleId];

	return (
		<Dialog>
			<Button aspect="default">
				{data.colorKeys.map((color) => (
					<ColorSwatch key={color} color={color} />
				))}
				{scaleId.charAt(0).toUpperCase() + scaleId.slice(1)}
			</Button>
			<Drawer placement="left">
				<DialogContent>
					<DialogHeader>
						<DialogHeading>{scaleId.charAt(0).toUpperCase() + scaleId.slice(1)} scale</DialogHeading>
					</DialogHeader>
					<DialogBody className="flex flex-col pb-4">
						<ColorKeysEditor scaleId={scaleId} />
						<RatiosEditor scaleId={scaleId} />
					</DialogBody>
				</DialogContent>
			</Drawer>
		</Dialog>
	);
}

function ColorKeysEditor({ scaleId }: { scaleId: ScaleId }) {
	const data = STATIC_COLORS[scaleId];

	return (
		<div>
			<p className="text-fg-muted text-sm">Color keys</p>
			<div className="mt-2 flex items-center gap-2">
				<div className="flex flex-wrap items-center gap-2">
					{data.colorKeys.map((color, i) => (
						<div key={color} className="flex items-center">
							<ColorPicker defaultValue={color}>
								<ColorPickerTrigger>
									<ColorSwatch />
								</ColorPickerTrigger>
								<ColorPickerContent>
									<ColorEditor />
								</ColorPickerContent>
							</ColorPicker>
							{i > 0 && (
								<Button className="rounded-l-none border-l-0">
									<Trash2Icon />
								</Button>
							)}
						</div>
					))}
					<Tooltip>
						<Button>
							<PlusIcon />
						</Button>
						<TooltipContent>Add color</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}

function RatiosEditor({ scaleId }: { scaleId: ScaleId }) {
	const data = STATIC_COLORS[scaleId];

	return (
		<div className="flex-1">
			<p className="text-fg-muted text-sm">Contrast ratios</p>
			<div className="flex items-stretch gap-4">
				<Slider
					aria-label="Ratios"
					orientation="vertical"
					defaultValue={data.ratios}
					minValue={1}
					maxValue={16}
					step={0.05}
					className="h-auto [&_[data-slot='slider-filler']]:hidden [&_[data-slot='slider-thumb']]:dragging:size-4 [&_[data-slot='slider-thumb']]:size-3 [&_[data-slot='slider-track']]:w-40 [&_[data-slot='slider-track']]:rounded-sm"
				>
					<SliderControl />
				</Slider>
				<Table aria-label="Color ratios">
					<TableHeader>
						<TableColumn id="token" isRowHeader>
							Token
						</TableColumn>
						<TableColumn id="ratio">Ratio</TableColumn>
						<TableColumn id="wcag">WCAG</TableColumn>
					</TableHeader>
					<TableBody>
						{data.ratios.map((ratio, i) => {
							const step = SCALE_STEPS[i];
							const requiredContrast = getWcagRequirement(i);
							return (
								<TableRow key={step}>
									<TableCell>
										<div className="flex items-center gap-2">
											<span className="font-mono text-fg-muted text-xs">{`${scaleId}-${step}`}</span>
										</div>
									</TableCell>
									<TableCell>
										<NumberField
											aria-label={`${scaleId}-${step} contrast ratio`}
											defaultValue={ratio}
											step={0.01}
											minValue={1}
											maxValue={20}
											className="w-20"
										/>
									</TableCell>
									<TableCell>
										{requiredContrast && (
											<Badge variant={ratio > requiredContrast ? "success" : "danger"} className="w-12 text-xs">
												{requiredContrast}:1
											</Badge>
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

const getWcagRequirement = (index: number) => {
	if (index === 5) return 3.0;
	if (index >= 6 && index <= 9) return 4.5;
	return null;
};
