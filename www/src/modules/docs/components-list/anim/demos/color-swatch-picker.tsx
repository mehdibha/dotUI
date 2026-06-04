"use client";

import { useState } from "react";

import { type Color, parseColor } from "react-aria-components/ColorArea";

import { ColorSwatchPicker, ColorSwatchPickerItem } from "@/registry/ui/color-swatch-picker";

import { AnimatedPreview } from "../animated-preview";

// ColorSwatchPicker is a react-aria collection (ListBox) — items must be direct children,
// so we target swatches by nth-child selector rather than wrapping them in a ref span.
const SWATCHES = ["#f43f5e", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#0ea5e9"] as const;
const INITIAL = parseColor(SWATCHES[0]);

export default function Demo() {
	const [value, setValue] = useState<Color>(INITIAL);
	return (
		<AnimatedPreview
			reset={() => setValue(INITIAL)}
			script={async (s) => {
				await s.wait(450);
				await s.click({ selector: ".cspick > *:nth-child(5)" }, () => setValue(parseColor(SWATCHES[4])));
				await s.wait(1000);
				await s.click({ selector: ".cspick > *:nth-child(3)" }, () => setValue(parseColor(SWATCHES[2])));
				await s.wait(1000);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{() => (
				<ColorSwatchPicker className="cspick" value={value} onChange={setValue}>
					{SWATCHES.map((color) => (
						<ColorSwatchPickerItem key={color} color={color} />
					))}
				</ColorSwatchPicker>
			)}
		</AnimatedPreview>
	);
}
