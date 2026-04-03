import { ColorSlider, ColorSliderControl } from "@/registry/ui/color-slider";

export default function Demo() {
	return (
		<ColorSlider aria-label="Opacity" defaultValue="#f00" channel="alpha" isDisabled>
			<ColorSliderControl />
		</ColorSlider>
	);
}
