import { Label } from "@/registry/ui/field";
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider";

export default function Demo() {
	return (
		<Slider defaultValue={[200, 300]} minValue={100} maxValue={500}>
			<div className="flex items-center justify-between">
				<Label>Price Range</Label>
				<SliderOutput />
			</div>
			<SliderControl />
		</Slider>
	);
}
