import { Label } from "@dotui/registry/ui/field";
import { Slider, SliderControl, SliderOutput } from "@dotui/registry/ui/slider";

export default function Demo() {
	return (
		<Slider defaultValue={[200, 300]} minValue={100} maxValue={500}>
			<Label>Price Range</Label>
			<SliderControl />
			<SliderOutput />
		</Slider>
	);
}
