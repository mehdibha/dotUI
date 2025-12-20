"use client";

import { Button } from "@dotui/registry/ui/button";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogHeading } from "@dotui/registry/ui/dialog";
import { Overlay } from "@dotui/registry/ui/overlay";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

import type { ScaleId } from "@/modules/style-editor/types";
import { SCALE_STEPS } from "@/modules/style-editor/types";

// Static generated colors for UI shell
const STATIC_SCALES: Record<ScaleId, { name: string; values: { name: string; value: string }[] }> = {
	neutral: {
		name: "neutral",
		values: SCALE_STEPS.map((step, i) => ({
			name: `neutral-${step}`,
			value: `hsl(220, ${5 + i}%, ${95 - i * 8}%)`,
		})),
	},
	accent: {
		name: "accent",
		values: SCALE_STEPS.map((step, i) => ({
			name: `accent-${step}`,
			value: `hsl(220, 90%, ${95 - i * 8}%)`,
		})),
	},
	success: {
		name: "success",
		values: SCALE_STEPS.map((step, i) => ({
			name: `success-${step}`,
			value: `hsl(142, 70%, ${95 - i * 8}%)`,
		})),
	},
	warning: {
		name: "warning",
		values: SCALE_STEPS.map((step, i) => ({
			name: `warning-${step}`,
			value: `hsl(38, 90%, ${95 - i * 8}%)`,
		})),
	},
	danger: {
		name: "danger",
		values: SCALE_STEPS.map((step, i) => ({
			name: `danger-${step}`,
			value: `hsl(0, 70%, ${95 - i * 8}%)`,
		})),
	},
	info: {
		name: "info",
		values: SCALE_STEPS.map((step, i) => ({
			name: `info-${step}`,
			value: `hsl(190, 80%, ${95 - i * 8}%)`,
		})),
	},
};

export function ColorScale({ scaleId }: { scaleId: ScaleId }) {
	const scale = STATIC_SCALES[scaleId];

	return (
		<div className="flex @lg:flex-row flex-col @lg:items-center @lg:gap-2 gap-0.5">
			<p className="w-16 text-fg-muted text-sm">{scale.name.charAt(0).toUpperCase() + scale.name.slice(1)}</p>
			<div className="flex flex-1 items-center gap-1">
				{scale.values.map((color, index) => (
					<Dialog key={color.name ?? color.value ?? `color-${index}`}>
						<Tooltip>
							<Button
								aria-label={color.name}
								className="h-8 flex-1 rounded-sm border"
								style={{ backgroundColor: color.value }}
							/>
							<TooltipContent>{color.name}</TooltipContent>
						</Tooltip>
						<Overlay type="popover" modalProps={{ className: "w-fit" }}>
							<DialogContent>
								<DialogHeader>
									<DialogHeading>{color.name}</DialogHeading>
								</DialogHeader>
								<DialogBody>
									<div className="flex items-center gap-2">
										<ColorSwatch color={color.value} />
										<p>{color.value}</p>
									</div>
								</DialogBody>
							</DialogContent>
						</Overlay>
					</Dialog>
				))}
			</div>
		</div>
	);
}
