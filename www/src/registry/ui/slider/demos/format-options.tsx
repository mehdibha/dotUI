import { Label } from "@/registry/ui/field";
import { Slider, SliderTrack, SliderOutput } from "@/registry/ui/slider";

export default function Demo() {
	return (
		<Slider formatOptions={{ style: "currency", currency: "JPY" }} defaultValue={60}>
			<Label>Price</Label>
			<SliderTrack />
			<SliderOutput />
		</Slider>
	);
}
