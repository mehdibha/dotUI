"use client";

import { useState } from "react";

import { type Color, parseColor } from "react-aria-components/ColorArea";

import { ColorPicker } from "@/registry/ui/color-picker";
import { ColorSlider, ColorSliderControl } from "@/registry/ui/color-slider";
import { ColorSwatch } from "@/registry/ui/color-swatch";

import { AnimatedPreview } from "../animated-preview";

const INITIAL = parseColor("hsl(8, 85%, 55%)");

export default function Demo() {
	const [value, setValue] = useState<Color>(INITIAL);
	return (
		<AnimatedPreview
			reset={() => setValue(INITIAL)}
			script={async (s) => {
				await s.wait(500);
				// Drag the hue slider; the picker's swatch recolors live from the shared value.
				await s.drag(
					{ selector: "[data-slot=color-thumb]" },
					{ selector: "[data-slot=color-thumb]" },
					(t) => setValue((c) => c.withChannelValue("hue", t * 360)),
					{ steps: 40 },
				);
				await s.wait(1100);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{() => (
				<ColorPicker value={value} onChange={setValue}>
					<div className="flex w-48 items-center gap-3">
						<ColorSwatch className="size-9 shrink-0 rounded-md" />
						<ColorSlider aria-label="Hue" channel="hue" className="flex-1">
							<ColorSliderControl />
						</ColorSlider>
					</div>
				</ColorPicker>
			)}
		</AnimatedPreview>
	);
}
