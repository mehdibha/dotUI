import { Slider, SliderTrack } from "@/registry/ui/slider";

export default function Demo() {
	return (
		<Slider defaultValue={50} aria-label="Opacity" orientation="vertical" className="w-8">
			<SliderTrack />
		</Slider>
	);
}
