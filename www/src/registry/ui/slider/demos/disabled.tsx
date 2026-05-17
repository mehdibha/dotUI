import { Label } from "@/registry/ui/field";
import { Slider, SliderTrack } from "@/registry/ui/slider";

export default function Demo() {
	return (
		<Slider defaultValue={50} isDisabled>
			<Label>Opacity</Label>
			<SliderTrack />
		</Slider>
	);
}
