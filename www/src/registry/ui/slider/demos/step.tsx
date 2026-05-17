import { Label } from "@/registry/ui/field";
import { Slider, SliderTrack } from "@/registry/ui/slider";

export default function Demo() {
	return (
		<Slider minValue={0} maxValue={100} step={5} defaultValue={50}>
			<Label>Opacity</Label>
			<SliderTrack />
		</Slider>
	);
}
