import { Label } from "@/registry/ui/field";
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider";

export default function Demo() {
	return (
		<Slider formatOptions={{ style: "currency", currency: "JPY" }} defaultValue={60}>
			<Label>Price</Label>
			<SliderControl />
			<SliderOutput />
		</Slider>
	);
}
