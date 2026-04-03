import { ColorSlider, ColorSliderControl } from "@/registry/ui/color-slider";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<ColorSlider aria-label="Hue" channel="hue" defaultValue="hsl(200, 100%, 50%)">
			<Label>Hue</Label>
			<ColorSliderControl />
		</ColorSlider>
	);
}
