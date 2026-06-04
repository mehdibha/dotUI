"use client";

import { useState } from "react";

import { type Color, parseColor } from "react-aria-components/ColorField";

import { ColorField } from "@/registry/ui/color-field";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";

import { AnimatedPreview } from "../animated-preview";

const INITIAL = parseColor("hsl(0, 90%, 55%)");

export default function Demo() {
	const [color, setColor] = useState<Color | null>(INITIAL);
	return (
		<AnimatedPreview
			reset={() => setColor(INITIAL)}
			script={async (s) => {
				await s.wait(500);
				// Type a hue value digit-by-digit; every accumulated number is a valid channel value,
				// so the field updates live (and never sees an unparseable partial string).
				await s.type("field", "265", (acc) => setColor(INITIAL.withChannelValue("hue", Number(acc))), {
					start: "",
					perChar: 230,
				});
				await s.wait(1400);
				await s.moveOff();
				await s.wait(700);
			}}
		>
			{(ref) => (
				<div ref={ref("field")} className="w-32">
					<ColorField colorSpace="hsl" channel="hue" value={color} onChange={setColor}>
						<Label>Hue</Label>
						<Input />
					</ColorField>
				</div>
			)}
		</AnimatedPreview>
	);
}
