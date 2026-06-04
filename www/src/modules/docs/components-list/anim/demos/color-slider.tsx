"use client";

import { useState } from "react";

import { parseColor } from "react-aria-components/ColorSlider";

import { ColorSlider, ColorSliderControl } from "@/registry/ui/color-slider";

import { AnimatedPreview } from "../animated-preview";

const INITIAL = parseColor("hsl(15, 100%, 50%)");

export default function Demo() {
	const [value, setValue] = useState(INITIAL);
	return (
		<AnimatedPreview
			reset={() => setValue(INITIAL)}
			script={async (s) => {
				await s.wait(500);
				// Sweep the hue thumb across the spectrum (15 → 330).
				await s.drag(
					{ selector: "[data-slot=color-thumb]" },
					{ selector: "[data-slot=color-thumb]" },
					(t) => setValue((c) => c.withChannelValue("hue", 15 + t * 315)),
					{ steps: 40 },
				);
				await s.wait(1200);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{() => (
				<div className="w-48">
					<ColorSlider aria-label="Hue" value={value} onChange={setValue} channel="hue">
						<ColorSliderControl />
					</ColorSlider>
				</div>
			)}
		</AnimatedPreview>
	);
}
