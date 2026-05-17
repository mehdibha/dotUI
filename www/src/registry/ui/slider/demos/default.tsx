import { Slider, SliderTrack } from "@/registry/ui/slider";

export default function Demo() {
	return (
		<Slider aria-label="Opacity" defaultValue={50}>
			<SliderTrack />
		</Slider>
	);
}
