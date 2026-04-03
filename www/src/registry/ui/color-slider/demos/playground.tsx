"use client";

import { ColorSlider, ColorSliderControl } from "@/registry/ui/color-slider";
import { Label } from "@/registry/ui/field";

interface ColorSliderPlaygroundProps {
	channel?: "hue" | "saturation" | "lightness" | "alpha";
	orientation?: "horizontal" | "vertical";
	isDisabled?: boolean;
}

export function ColorSliderPlayground({
	channel = "hue",
	orientation = "horizontal",
	isDisabled = false,
}: ColorSliderPlaygroundProps) {
	return (
		<ColorSlider defaultValue="hsl(0, 100%, 50%)" channel={channel} orientation={orientation} isDisabled={isDisabled}>
			<Label>{channel}</Label>
			<ColorSliderControl />
		</ColorSlider>
	);
}
