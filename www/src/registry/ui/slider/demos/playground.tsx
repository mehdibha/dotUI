"use client";

import { Label } from "@/registry/ui/field";
import { Slider, SliderControl, type SliderProps } from "@/registry/ui/slider";

export default function Demo({
	label = "Volume",
	orientation = "horizontal",
	isDisabled = false,
}: {
	label?: string;
	orientation?: SliderProps["orientation"];
	isDisabled?: boolean;
} = {}) {
	return (
		<Slider defaultValue={50} orientation={orientation} isDisabled={isDisabled}>
			{label && <Label>{label}</Label>}
			<SliderControl />
		</Slider>
	);
}
