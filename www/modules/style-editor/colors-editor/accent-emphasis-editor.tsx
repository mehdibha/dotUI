"use client";

import { Slider, SliderControl } from "@dotui/registry/ui/slider";

export const AccentEmphasisEditor = () => {
	return (
		<Slider aria-label="Accent emphasis" defaultValue={2} minValue={0} maxValue={3} step={1} className="w-full">
			<SliderControl />
		</Slider>
	);
};
