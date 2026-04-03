import { Label } from "@/registry/ui/field";
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider";

export default function Demo() {
	return (
		<Slider defaultValue={[200, 300]} minValue={100} maxValue={500}>
			<Label>Price Range</Label>
			<SliderControl />
			<SliderOutput />
		</Slider>
	);
}
