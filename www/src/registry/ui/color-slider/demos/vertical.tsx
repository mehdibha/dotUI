import { ColorSlider, ColorSliderControl } from "@/registry/ui/color-slider";

export default function Demo() {
	return (
		<ColorSlider orientation="vertical" channel="hue" defaultValue="hsl(0, 100%, 50%)">
			<ColorSliderControl />
		</ColorSlider>
	);
}
