"use client";

import { ColorSlider, ColorSliderControl } from "@/registry/ui/color-slider";
import { Label } from "@/registry/ui/field";

export default function Demo({
	channel = "hue",
	orientation = "horizontal",
	isDisabled = false,
}: {
	channel?: "hue" | "saturation" | "lightness" | "alpha";
	orientation?: "horizontal" | "vertical";
	isDisabled?: boolean;
} = {}) {
	return (
		<ColorSlider defaultValue="hsl(0, 100%, 50%)" channel={channel} orientation={orientation} isDisabled={isDisabled}>
			<Label>Hue</Label>
			<ColorSliderControl />
		</ColorSlider>
	);
}
