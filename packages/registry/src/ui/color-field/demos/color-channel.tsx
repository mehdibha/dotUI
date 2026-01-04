"use client";

import React from "react";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";

import { ColorField } from "@dotui/registry/ui/color-field";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";

export default function Demo() {
	const [color, setColor] = React.useState<Color | null>(parseColor("#7f007f"));

	return (
		<div className="grid grid-cols-3 gap-2 *:w-24">
			<ColorField colorSpace="hsl" channel="hue" value={color} onChange={setColor}>
				<Label>Hue</Label>
				<Input />
			</ColorField>

			<ColorField colorSpace="hsl" channel="saturation" value={color} onChange={setColor}>
				<Label>Saturation</Label>
				<Input />
			</ColorField>

			<ColorField colorSpace="hsl" channel="lightness" value={color} onChange={setColor}>
				<Label>Lightness</Label>
				<Input />
			</ColorField>
		</div>
	);
}
