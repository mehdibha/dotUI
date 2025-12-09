import { Slider, SliderControl } from "@dotui/registry/ui/slider";

export default function Page() {
	return (
		<Slider aria-label="Opacity" defaultValue={50} className="w-64">
			<SliderControl />
		</Slider>
	);
}
