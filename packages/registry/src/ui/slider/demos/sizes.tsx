import { Label } from "@dotui/registry/ui/field";
import { Slider, SliderControl } from "@dotui/registry/ui/slider";

export default function Demo() {
	return (
		<div className="space-y-4">
			<Slider defaultValue={50}>
				<Label>sm</Label>
				<SliderControl /> {/*size="sm" */}
			</Slider>
			<Slider defaultValue={50}>
				<Label>md</Label>
				<SliderControl /> {/*size="md" */}
			</Slider>
			<Slider defaultValue={50}>
				<Label>lg</Label>
				<SliderControl /> {/*size="lg" */}
			</Slider>
		</div>
	);
}
