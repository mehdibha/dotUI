import { Label } from "@/registry/ui/field";
import { Slider, SliderTrack } from "@/registry/ui/slider";

export default function Demo() {
	return (
		<Slider minValue={1} maxValue={50} defaultValue={25}>
			<Label>Cookies to</Label>
			<SliderTrack />
		</Slider>
	);
}
