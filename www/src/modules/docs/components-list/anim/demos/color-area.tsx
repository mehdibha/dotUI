"use client";

import { useState } from "react";

import { parseColor } from "react-aria-components/ColorArea";

import { ColorArea } from "@/registry/ui/color-area";

import { AnimatedPreview } from "../animated-preview";

const INITIAL = parseColor("hsb(280, 30%, 90%)");

export default function Demo() {
	const [value, setValue] = useState(INITIAL);
	return (
		<AnimatedPreview
			reset={() => setValue(INITIAL)}
			script={async (s) => {
				await s.wait(500);
				// 2D drag: the cursor tracks the thumb while saturation follows x-progress and
				// brightness follows (inverted) y-progress.
				await s.drag(
					{ selector: "[data-slot=color-thumb]" },
					{ selector: "[data-slot=color-thumb]" },
					(t) =>
						setValue((c) => c.withChannelValue("saturation", 30 + t * 60).withChannelValue("brightness", 90 - t * 55)),
					{ steps: 36 },
				);
				await s.wait(1200);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{() => (
				<ColorArea
					aria-label="Color"
					value={value}
					onChange={setValue}
					colorSpace="hsb"
					xChannel="saturation"
					yChannel="brightness"
					className="w-36"
				/>
			)}
		</AnimatedPreview>
	);
}
