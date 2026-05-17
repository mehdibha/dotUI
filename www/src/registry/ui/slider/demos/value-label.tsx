"use client";

import { Label } from "@/registry/ui/field";
import { Slider, SliderTrack, SliderOutput } from "@/registry/ui/slider";

export default function Demo() {
	return (
		<div className="space-y-6">
			<Slider defaultValue={50} className="w-60!">
				<Label>Donuts to buy</Label>
				<SliderTrack />
				<SliderOutput />
			</Slider>
			<Slider defaultValue={50} className="w-60!">
				<Label>Donuts to buy</Label>
				<SliderTrack />
				<SliderOutput>{({ state }) => `${state.values[0]} of 100 Donuts`}</SliderOutput>
			</Slider>
		</div>
	);
}
