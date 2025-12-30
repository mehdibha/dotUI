import { Slider, SliderControl } from "@dotui/registry/ui/slider";

export function SliderDemo() {
	return (
		<Slider aria-label="Opacity" defaultValue={50} className="w-64">
			<SliderControl />
		</Slider>
	);
}
