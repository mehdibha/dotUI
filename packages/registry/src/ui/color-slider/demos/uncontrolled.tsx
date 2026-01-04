import { ColorSlider, ColorSliderControl } from "@dotui/registry/ui/color-slider";

export default function Demo() {
	return (
		<ColorSlider aria-label="Hue" channel="hue" defaultValue="hsl(0, 100%, 50%)">
			<ColorSliderControl />
		</ColorSlider>
	);
}
