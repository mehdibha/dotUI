"use client";

import { Description, Label } from "@dotui/registry/ui/field";
import { Slider, SliderControl, SliderFiller, SliderOutput, SliderThumb } from "@dotui/registry/ui/slider";

export function SliderDemo() {
	return (
		<div className="space-y-4">
			<div className="flex gap-8">
				{/* Horizontal Sliders */}
				<div
					className="space-y-4"
					// TODO: check on flex, it's awful
					// className="flex items-start"
				>
					<Slider aria-label="simple slider" defaultValue={50}>
						<SliderControl />
					</Slider>

					<Slider aria-label="range slider" defaultValue={[25, 75]}>
						<SliderControl />
					</Slider>

					<Slider aria-label="multiple values slider" defaultValue={[15, 40, 60]}>
						<SliderControl />
					</Slider>

					<Slider aria-label="disabled" defaultValue={50} isDisabled>
						<SliderControl />
					</Slider>
				</div>

				{/* Veritcal Sliders */}
				<div className="flex gap-4">
					<Slider aria-label="simple slider" orientation="vertical" defaultValue={50}>
						<SliderControl />
					</Slider>

					<Slider aria-label="range slider" orientation="vertical" defaultValue={[25, 75]}>
						<SliderControl />
					</Slider>

					<Slider aria-label="multiple values slider" orientation="vertical" defaultValue={[15, 40, 60]}>
						<SliderControl />
					</Slider>

					<Slider aria-label="disabled" orientation="vertical" defaultValue={50} isDisabled>
						<SliderControl />
					</Slider>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-4 *:w-full">
				<Slider defaultValue={30}>
					<div className="flex items-center justify-between">
						<Label>Volume</Label>
						<SliderOutput />
					</div>
					<SliderControl>
						<SliderFiller />
						<SliderThumb />
					</SliderControl>
					<Description>Adjust the volume of the audio</Description>
				</Slider>

				<Slider defaultValue={[25, 75]} formatOptions={{ style: "currency", currency: "USD" }}>
					<div className="flex items-center justify-between">
						<Label>Price range</Label>
						<SliderOutput />
					</div>
					<SliderControl />
					<Description>Adjust the price range</Description>
				</Slider>

				<Slider defaultValue={[25, 75]} isDisabled>
					<div className="flex items-center justify-between">
						<Label>Price range</Label>
						<SliderOutput />
					</div>
					<SliderControl />
					<Description>Adjust the price range</Description>
				</Slider>
			</div>
		</div>
	);
}
