"use client";

import { Label } from "@dotui/registry/ui/field";
import { Slider, SliderControl } from "@dotui/registry/ui/slider";

export const ColorAdjustments = () => {
	return (
		<>
			<Slider aria-label="Lightness" defaultValue={95} minValue={0} maxValue={100} className="col-span-2">
				<Label>Lightness</Label>
				<SliderControl className="w-full" />
			</Slider>
			<Slider aria-label="Saturation" defaultValue={100} minValue={0} maxValue={100}>
				<Label>Saturation</Label>
				<SliderControl />
			</Slider>
			<Slider aria-label="Contrast" defaultValue={100} minValue={0} maxValue={500}>
				<Label>Contrast</Label>
				<SliderControl />
			</Slider>
		</>
	);
};
