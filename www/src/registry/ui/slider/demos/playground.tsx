"use client";

import { Label } from "@/registry/ui/field";
import { Slider, SliderTrack } from "@/registry/ui/slider";

interface SliderPlaygroundProps {
	label?: string;
	isDisabled?: boolean;
	orientation?: "horizontal" | "vertical";
}

export function SliderPlayground({ label = "Volume", ...props }: SliderPlaygroundProps) {
	return (
		<Slider defaultValue={50} {...props}>
			{label && <Label>{label}</Label>}
			<SliderTrack />
		</Slider>
	);
}
