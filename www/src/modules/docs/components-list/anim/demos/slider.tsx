"use client";

import { useState } from "react";

import { Slider, SliderControl, SliderFill, SliderThumb, SliderTrack } from "@/registry/ui/slider";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [value, setValue] = useState(20);
	return (
		<AnimatedPreview
			reset={() => setValue(20)}
			script={async (s) => {
				await s.wait(500);
				await s.drag({ selector: "input" }, { selector: "input" }, (t) => setValue(Math.round(20 + t * 65)), {
					steps: 36,
				});
				await s.wait(1300);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{() => (
				<div className="w-56">
					<Slider aria-label="Volume" value={value} onChange={(v) => setValue(Array.isArray(v) ? (v[0] ?? 0) : v)}>
						<SliderControl>
							<SliderTrack>
								<SliderFill />
							</SliderTrack>
							<SliderThumb />
						</SliderControl>
					</Slider>
				</div>
			)}
		</AnimatedPreview>
	);
}
