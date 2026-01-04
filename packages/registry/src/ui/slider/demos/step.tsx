import { Label } from "@dotui/registry/ui/field";
import { Slider, SliderControl } from "@dotui/registry/ui/slider";

export default function Demo() {
	return (
		<Slider minValue={0} maxValue={100} step={5} defaultValue={50}>
			<Label>Opacity</Label>
			<SliderControl />
		</Slider>
	);
}
