import { Label } from "@/registry/ui/field";
import { Slider, SliderControl } from "@/registry/ui/slider";

export default function Demo() {
	return (
		<div className="space-y-4">
			<Slider defaultValue={50}>
				<Label>Opacity</Label>
				<SliderControl />
			</Slider>
			<Slider defaultValue={50} aria-label="Opacity" />
		</div>
	);
}
