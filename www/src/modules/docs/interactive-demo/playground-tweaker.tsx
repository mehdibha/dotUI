import { useEffect, useState } from "react";
import { createPortal, flushSync } from "react-dom";

import { SlidersHorizontalIcon, XIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Label } from "@/registry/ui/field";
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider";
import { Switch } from "@/registry/ui/switch";
import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

export interface PlaygroundLayoutValues {
	/** Controls beside the preview ("horizontal") or beneath it ("vertical"). */
	layout: "horizontal" | "vertical";
	/** Controls bare in the panel ("inline") or grouped in a card ("card"). */
	variant: "inline" | "card";
	/** Width (px) of the controls column when laid out to the right. */
	width: number;
}

interface PlaygroundTweakerProps extends PlaygroundLayoutValues {
	onChange: (partial: Partial<PlaygroundLayoutValues>) => void;
}

const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

/** Crossfade layout swaps the way the old inline toggle did, when supported. */
function withViewTransition(fn: () => void) {
	if (typeof document !== "undefined" && document.startViewTransition) {
		document.startViewTransition(() => flushSync(fn));
	} else {
		fn();
	}
}

const sectionLabel = "text-[0.8125rem] font-medium text-fg-muted";

/**
 * A floating panel for tuning the playground layout live: controls on the right or bottom,
 * bare or in a card, and how wide the right-hand column is. Portaled to the body so the demo's
 * `overflow-hidden` panel can't clip it; render-gated on mount so it stays out of SSR.
 */
export function PlaygroundTweaker({ layout, variant, width, onChange }: PlaygroundTweakerProps) {
	const [mounted, setMounted] = useState(false);
	const [open, setOpen] = useState(true);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null;

	const atRight = layout === "horizontal";

	const node = open ? (
		<div className="fixed right-4 bottom-4 z-50 w-64 rounded-xl border bg-card p-4 shadow-lg">
			<div className="mb-3 flex items-center justify-between">
				<span className="text-sm font-medium">Playground layout</span>
				<Button
					aria-label="Hide layout tweaker"
					variant="quiet"
					size="sm"
					className="size-7"
					onPress={() => setOpen(false)}
				>
					<XIcon />
				</Button>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-1.5">
					<span className={sectionLabel}>Position</span>
					<ToggleButtonGroup
						aria-label="Controls position"
						size="sm"
						selectionMode="single"
						disallowEmptySelection
						selectedKeys={[layout]}
						onSelectionChange={(keys) => {
							const next = keys.values().next().value as PlaygroundLayoutValues["layout"] | undefined;
							if (next && next !== layout) withViewTransition(() => onChange({ layout: next }));
						}}
						className="w-full"
					>
						<ToggleButton id="horizontal" className="flex-1">
							Right
						</ToggleButton>
						<ToggleButton id="vertical" className="flex-1">
							Bottom
						</ToggleButton>
					</ToggleButtonGroup>
				</div>

				<div className="flex items-center justify-between">
					<span className={sectionLabel}>Card</span>
					<Switch
						aria-label="Card"
						size="sm"
						isSelected={variant === "card"}
						onChange={(selected) => withViewTransition(() => onChange({ variant: selected ? "card" : "inline" }))}
					/>
				</div>

				<Slider
					aria-label="Max width"
					value={width}
					minValue={MIN_WIDTH}
					maxValue={MAX_WIDTH}
					step={4}
					isDisabled={!atRight}
					onChange={(value) => onChange({ width: Array.isArray(value) ? value[0] : value })}
					className="w-full"
				>
					<div className="flex items-center justify-between">
						<Label>Max width</Label>
						<SliderOutput>{({ state }) => `${state.values[0]}px`}</SliderOutput>
					</div>
					<SliderControl />
				</Slider>
			</div>
		</div>
	) : (
		<Button
			aria-label="Show layout tweaker"
			className="fixed right-4 bottom-4 z-50 size-11 rounded-full shadow-lg"
			onPress={() => setOpen(true)}
		>
			<SlidersHorizontalIcon />
		</Button>
	);

	return createPortal(node, document.body);
}
